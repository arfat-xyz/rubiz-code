import { formatResponse, routeErrorHandler } from "@/lib/api-response-handler";
import { db } from "@/lib/db";
import { vectorDBstore } from "@/lib/google-get-ai";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";

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
      "File must be less than 2MB"
    ),
});

/**
 * Handles a POST request.
 * @param request - The incoming request object.
 * @returns A formatted response or error.
 */
export async function POST(request: Request) {
  try {
    const transaction = await db.$transaction(async (prisma) => {
      const formData = await request.formData();
      const jsonData = Object.fromEntries(formData.entries());
      const body = postSchema.parse({
        pdfFile: jsonData.pdfFile,
      });

      // Start transaction: Create the entry in rubizCodeFile
      const data = await prisma.rubizCodeFile.create({
        data: {
          name: body.pdfFile.name,
          size: body.pdfFile.size,
        },
      });

      // Store the vector (you may need to adjust this to fit your logic)
      const uploadedToVector = await vectorDBstore(body.pdfFile, data.id);
      if (uploadedToVector.length < 1) {
        throw new ApiError(401, "For some reson file not uploaded");
      }

      // If everything is successful, return the successful response
      return formatResponse(data, "PDF uploaded successfully");
    });

    // Return the result outside the transaction block
    return transaction;
  } catch (error) {
    // If there's an error, handle it using routeErrorHandler
    return routeErrorHandler(error);
  }
}
