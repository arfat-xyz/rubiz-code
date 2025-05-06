import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";
import {
  formatErrorResponse,
  formatResponse,
  routeErrorHandler,
} from "@/lib/api-response-handler";
import { db } from "@/lib/db";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import { embeddings, textSplitter } from "@/lib/google-get-ai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

const postSchema = z.object({
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      `File must be less than 2MB `
    ),
});
// Function to embed text and upload to Supabase
const vectorDBstore = async (file: File, id: string) => {
  // Initialize the text splitter for markdown
  const loader = new PDFLoader(file);

  // Split the input text into documents
  const docOutput = await loader.load();
  const docOutputSplitted = await textSplitter.splitDocuments(docOutput);
  // Collect all documents in a single array
  const allDocuments: Document[] = [];

  // Process each document
  for (const doc of docOutputSplitted) {
    const { metadata, pageContent } = doc; // Use `pageContent` for the text content

    // Generate embeddings for each chunk and create Document objects
    allDocuments.push(
      new Document({
        pageContent: pageContent, // The text content of the chunk
        metadata: { ...metadata, id: id }, // Metadata including the id
      })
    );
  }
  // Add this to your vector-store.ts
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new ApiError(404, "Supabase environment variables not configured");
  }
  // Creating supabase client
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  // Vector store
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME,
    queryName: process.env.NEXT_PUBLIC_SUPABASE_QUERY_NAME,
  });

  // Add all documents to the vector store at once
  const response = await vectorStore.addDocuments(allDocuments);
  return response;
};

/**
 * Handles a POST request.
 * @param request - The incoming request object.
 * @returns A formatted response or error.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jsonData = Object.fromEntries(formData.entries());
    const body = postSchema.parse({
      pdfFile: jsonData.pdfFile,
    });
    const data = await db.rubizCodeFile.create({
      data: {
        name: body.pdfFile.name,
        size: body.pdfFile.size,
      },
    });

    // Store the vector (you may need to adjust this to fit your logic)
    const uploadedToVector = await vectorDBstore(body.pdfFile, data.id);
    if (uploadedToVector.length < 1) {
      const deltededFile = await db.rubizCodeFile.delete({
        where: { id: data.id },
      });
      console.log(`File is deleted`, { deltededFile });
      return formatErrorResponse("File not uploaded to vector store", 401);
    } else {
      return formatResponse(data, "Uploaded completed successfully", 200);
    }
  } catch (error) {
    // If there's an error, handle it using routeErrorHandler
    return routeErrorHandler(error);
  }
}
