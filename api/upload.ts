import type { VercelRequest, VercelResponse } from "@vercel/node";

import Busboy from "busboy";
import pdfParse from "pdf-parse";

import type { Readable } from "stream";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
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

    parser.on("file", (fieldName, file) => {
      if (fieldName !== "file") {
        file.resume();
        return;
      }

      fileFound = true;

      const chunks: Buffer[] = [];

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
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const fileBuffer = await getUploadedFile(req);

    // Basic PDF signature validation
    const signature = fileBuffer.subarray(0, 5).toString();

    if (signature !== "%PDF-") {
      return res.status(400).json({
        success: false,
        message: "Invalid PDF document",
      });
    }

    const pdfData = await pdfParse(fileBuffer);

    if (!pdfData.text.trim()) {
      return res.status(422).json({
        success: false,
        message: "No readable text found in this PDF",
      });
    }

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

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the PDF",
    });
  }
}
