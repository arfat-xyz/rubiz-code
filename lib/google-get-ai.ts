import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TaskType } from "@google/generative-ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Document } from "langchain/document";

// Initialize Google Generative AI Embeddings
export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const textSplitter = new CharacterTextSplitter({
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

export const systemPrompt = `You are an AI chatbot designed to respond to user queries using relevant context provided in the form of text and images. Your responses must be formatted in Markdown to enhance readability and visual appeal.

**Instructions:**
1. **Context and Query Interpretation:**  
   - Receive the context as a detailed description of the topic or subject matter.  
   - Receive the user's query that requires a specific answer based on the context.  

2. **Image Handling:**  
   - Identify any relevant images from the context that can support your answer.  
   - Ensure that image URLs contain "res.cloudinary.com" and format them to display as images in Markdown.  

3. **Response Formatting:**  
   - Begin your response with a brief acknowledgment or summary of the user's query.  
   - Provide a detailed answer based on the context, ensuring clarity and conciseness.  
   - Include images using the Markdown syntax:  
     ![Alt Text](image_url), replacing "Alt Text" with a descriptive title for the image and "image_url" with the actual Cloudinary image link.  

4. **Markdown Guidelines:**  
   - Use headers (e.g., #, ##, ###) to organize content when necessary.  
   - Utilize bullet points or numbered lists for clarity when presenting multiple pieces of information.  
   - Highlight important terms using **bold** or *italics* as appropriate.  

5. **Examples:**  
   - If applicable, provide examples or scenarios to illustrate your points, ensuring they are relevant to the user's query.  

6. **Out of Context Handling:**  
   - If the query is **not related** to the provided context, respond with:  
     _"Sorry, I don’t know the answer to this. Please contact author for further assistance."_  

7. **Final Touch:**  
   - Conclude your response with a summary or a call to action if further information is needed or if specific follow-up questions should be asked.  

### **Prompt Structure:**  
**Context:** {context}  
**Query:** {input}  

### **Response:**  
1. Acknowledge the query.  
2. Provide a detailed answer based on the context.  
3. Include relevant images formatted in Markdown.  
4. If the query is out of context, provide the fallback message.  

`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["human", "{input}"],
]);

// Create the retrieval chain
const retriever = vectorStore.asRetriever();
// Create the RetrievalQAChain
const retrievalQAChain = await createRetrievalChain({
  retriever,
  combineDocsChain: promptTemplate,
});

// Function to invoke the RAG chain
export const geminiAskQuestion = async (input: string) => {
  try {
    // Call the retrieval chain with the input query
    const response = await retrievalQAChain.invoke({
      input,
    });
    return response.answer;
  } catch (error) {
    console.error("Error in askQuestion:", error);
    throw error;
  }
};

// Function to embed text and upload to Supabase
export const vectorDBstore = async (file: File, id: string) => {
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
export const vectorDBSimilaritySearch = async (
  query: string
): Promise<string> => {
  try {
    // Generate the embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);

    // Perform the similarity search using Supabase client
    const { data, error } = await supabaseClient.rpc(
      process.env.NEXT_PUBLIC_SUPABASE_QUERY_NAME!,
      {
        query_embedding: queryEmbedding,
      }
    );

    if (error) {
      console.error("Error performing manual similarity search:", error);
      throw error;
    }

    // Extract the pageContent from the results
    const similarTexts = data.map((doc: { content: string }) => doc.content); // Adjust based on your table schema
    const combinedText = similarTexts.join("\n\n"); // Use double newlines to separate documents

    return combinedText;
  } catch (error) {
    console.error("Error in manual similarity search:", error);
    throw error;
  }
};

// Function to get an answer from a query
export const getAnswerFromQuery = async (query: string): Promise<string> => {
  try {
    // Generate the embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    // Perform the similarity search using Supabase client
    const { data, error } = await supabaseClient.rpc(
      process.env.NEXT_PUBLIC_SUPABASE_QUERY_NAME!,
      {
        query_embedding: queryEmbedding,
        match_count: 2,
      }
    );

    if (error) {
      throw new Error(`Error performing similarity search: ${error.message}`);
    }

    // Combine the retrieved documents into a single context
    const combinedText = data
      .map((doc: { content: string }) => doc.content)
      .join("\n\n");

    // Extract image URLs from the context if any
    const imageUrls = data
      .filter((doc: Document) => doc.metadata && doc.metadata.imageUrl)
      .map((doc: Document) => doc.metadata.imageUrl);

    // Generate an answer using the LLM
    const response = await llm.invoke(
      await promptTemplate.format({
        context: combinedText,
        input: query,
      })
    );

    // Format the response in Markdown
    let markdownResponse = `${response.content}\n\n`;

    // Include images in the response if any
    if (imageUrls.length > 0) {
      markdownResponse += `**Images:**\n\n`;
      imageUrls.forEach((url: string) => {
        markdownResponse += `![Image](${url})\n\n`;
      });
    }

    // Return the generated answer in Markdown format
    return markdownResponse;
  } catch (error) {
    console.error("Error in getAnswerFromQuery:", error);
    throw error;
  }
};
