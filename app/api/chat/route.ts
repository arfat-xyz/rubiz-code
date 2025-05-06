import {
  formatErrorResponse,
  routeErrorHandler,
} from "@/lib/api-response-handler";
import { db } from "@/lib/db";
import { createIdFilterRetriever, promptTemplate } from "@/lib/google-get-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const SingleConversationSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().min(1, "Conversation ID cannot be empty"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { conversationId, message } = SingleConversationSchema.parse(json);

    // Check if file exists
    const fileExist = await db.rubizCodeFile.count({
      where: { id: conversationId },
    });

    if (!fileExist) {
      return formatErrorResponse("File not found", 404);
    }

    // Create a transform stream for the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Process the stream in the background
    (async () => {
      try {
        const data = await createIdFilterRetriever(conversationId, message);
        const combinedText = data.map((doc) => doc.pageContent).join("\n\n");

        const streamingLlm = new ChatGoogleGenerativeAI({
          model: "gemini-1.5-pro",
          temperature: 0.7,
          maxOutputTokens: 1000,
          streaming: true,
        });

        const prompt = await promptTemplate.format({
          context: combinedText,
          input: message,
        });

        const llmStream = await streamingLlm.stream(prompt);

        // Write each chunk to the stream
        for await (const chunk of llmStream) {
          const content = chunk.content;
          if (typeof content === "string") {
            await writer.write(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ token: content })}\n\n`
              )
            );
          }
        }

        // Signal completion
        await writer.write(new TextEncoder().encode(`data: [DONE]\n\n`));
      } catch (error) {
        console.error("Stream error:", error);
        await writer.write(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              error: (error as Error)?.message
                ? (error as Error)?.message
                : "Something went wrong",
            })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    // Return the readable stream
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return routeErrorHandler(error);
  }
}
