import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TaskType } from "@google/generative-ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";

// Initialize Google Generative AI Embeddings
export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

export const textSplitter = new CharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 80,
});

// Creating supabase client
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Vector store
const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME,
  queryName: process.env.NEXT_PUBLIC_SUPABASE_QUERY_NAME,
});

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.7,
  maxOutputTokens: 1000,
});

export const systemPrompt = `You are an AI chatbot designed to respond to user queries using relevant context provided in the form of text. Your responses must be formatted in Markdown to enhance readability and visual appeal.

### **Prompt Structure:**  
**Context:** {context}  
**Query:** {input}  
**Instructions:**  
1. Analyze the provided context to identify the relevant information that relates to the input query.  
2. If there is a clear match between the context and the input, generate a comprehensive and informative response based on the context.  
3. If the context does not provide adequate information to address the input query, return the following response: "Sorry, I don’t know."  
4. Ensure that the response is clear, concise, and directly addresses the input while remaining aligned with the context.  
5. Maintain a neutral tone and avoid personal opinions or irrelevant information in the response.
6. Please response geetings type input and then response what user want to know about your context.

`;

export const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{input}"],
]);

// Create the retrieval chain
// const retriever = vectorStore.asRetriever();
// Create the RetrievalQAChain
// const retrievalQAChain = await createRetrievalChain({
//   retriever,
//   combineDocsChain: promptTemplate,
// });

// Function to invoke the RAG chain
// export const geminiAskQuestion = async (input: string) => {
//   try {
//     // Call the retrieval chain with the input query
//     const response = await retrievalQAChain.invoke({
//       input,
//     });
//     return response.answer;
//   } catch (error) {
//     console.error("Error in askQuestion:", error);
//     throw error;
//   }
// };
export const createIdFilterRetriever = async (id: string, input: string) => {
  return await vectorStore.similaritySearch(input, 2, { id });
};

// Function to delete data by metadata
export const vectorDBDeleteByMetadata = async (id: string) => {
  // Delete rows where metadata.id matches the provided id
  const { data, error } = await supabaseClient
    .from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!) // Replace with your table name
    .delete()
    .eq("metadata->>id", id); // Use ->> to query JSONB fields

  if (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
  return data;
};

// Function to manually perform similarity search
// export const vectorDBSimilaritySearch = async (
//   query: string
// ): Promise<string> => {
//   try {
//     // Generate the embedding for the query
//     const queryEmbedding = await embeddings.embedQuery(query);

//     // Perform the similarity search using Supabase client
//     const { data, error } = await supabaseClient.rpc(
//       process.env.NEXT_PUBLIC_SUPABASE_QUERY_NAME!,
//       {
//         query_embedding: queryEmbedding,
//       }
//     );

//     if (error) {
//       console.error("Error performing manual similarity search:", error);
//       throw error;
//     }

//     // Extract the pageContent from the results
//     const similarTexts = data.map((doc: { content: string }) => doc.content); // Adjust based on your table schema
//     const combinedText = similarTexts.join("\n\n"); // Use double newlines to separate documents

//     return combinedText;
//   } catch (error) {
//     console.error("Error in manual similarity search:", error);
//     throw error;
//   }
// };

// Function to get an answer from a query
// export const getAnswerFromQuery = async (
//   query: string,
//   id: string
// ): Promise<string> => {
//   try {
//     // Perform the similarity search using Supabase client
//     const data = await createIdFilterRetriever(id, query);

//     // Combine the retrieved documents into a single context
//     const combinedText = data.map((doc) => doc.pageContent).join("\n\n");

//     // Generate an answer using the LLM
//     const response = await llm.stream(
//       await promptTemplate.format({
//         context: combinedText,
//         input: query,
//       })
//     );

//     // Return the generated answer in Markdown format
//     return `${response?.content}\n\n`;
//   } catch (error) {
//     console.error("Error in getAnswerFromQuery:", error);
//     throw error;
//   }
// };
