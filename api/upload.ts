import type { VercelRequest, VercelResponse } from "@vercel/node";
import Busboy from "busboy";
import pdfParse from "pdf-parse";
import type { Readable } from "stream";

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Disable Vercel's default body parser.
// Busboy needs access to the raw request stream.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extract uploaded PDF from multipart/form-data
function getUploadedFile(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let uploadedFile: Buffer | null = null;
    let fileError: Error | null = null;
    let fileFound = false;

    let parser: ReturnType<typeof Busboy>;

    try {
      parser = Busboy({
        headers: req.headers,
        limits: {
          fileSize: MAX_FILE_SIZE,
          files: 1,
        },
      });
    } catch {
      reject(new Error("Invalid multipart request"));
      return;
    }

    parser.on("file", (fieldName, file, info) => {
      if (fieldName !== "file") {
        file.resume();
        return;
      }

      fileFound = true;

      const chunks: Buffer[] = [];

      // Basic MIME type check
      if (info.mimeType !== "application/pdf") {
        fileError = new Error("Only PDF files are allowed");
      }

      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("limit", () => {
        fileError = new Error("File exceeds 10 MB limit");
      });

      file.on("error", (error) => {
        fileError = error;
      });

      file.on("end", () => {
        if (!fileError) {
          uploadedFile = Buffer.concat(chunks);
        }
      });
    });

    parser.on("error", reject);

    parser.on("finish", () => {
      if (fileError) {
        reject(fileError);
        return;
      }

      if (!fileFound || !uploadedFile) {
        reject(new Error("No PDF file was uploaded"));
        return;
      }

      resolve(uploadedFile);
    });

    (req as unknown as Readable).pipe(parser);
  });
}

// Main API handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Validate request content type
  const contentType = req.headers["content-type"] || "";

  if (!contentType.includes("multipart/form-data")) {
    return res.status(415).json({
      success: false,
      message: "Expected multipart/form-data",
    });
  }

  try {
    const fileBuffer = await getUploadedFile(req);

    // Check PDF file signature
    const signature = fileBuffer.subarray(0, 5).toString();

    if (signature !== "%PDF-") {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF document",
      });
    }

    // Extract PDF text
    const pdfData = await pdfParse(fileBuffer);

    // Reject PDFs without readable text
    if (!pdfData.text.trim()) {
      return res.status(422).json({
        success: false,
        message: "No readable text found in this PDF. It may be scanned.",
      });
    }

    // Successful response
    return res.status(200).json({
      success: true,
      message: "PDF processed successfully",
      data: {
        fileSize: fileBuffer.length,
        totalPages: pdfData.numpages,
        extractedText: pdfData.text,
      },
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while processing the PDF";

    return res.status(400).json({
      success: false,
      message,
    });
  }
}
