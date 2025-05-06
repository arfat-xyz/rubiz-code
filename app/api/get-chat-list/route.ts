import { formatResponse, routeErrorHandler } from "@/lib/api-response-handler";
import { db } from "@/lib/db";
import { formatFileSize } from "@/utils/utils-functions";
export const dynamic = "force-dynamic";
/**
 * Handles a POST request.
 * @param request - The incoming request object.
 * @returns A formatted response or error.
 */
export async function GET(request: Request) {
  try {
    const allFiles = await db.rubizCodeFile
      .findMany({
        orderBy: {
          createdAt: "desc",
        },
      })
      .then((d) =>
        d.map((file) => ({
          ...file,
          size: formatFileSize(file.size),
        }))
      );
    return formatResponse(allFiles, "Data fetched successfully");
  } catch (error) {
    console.log("Error", { error });
    return routeErrorHandler(error);
  }
}
