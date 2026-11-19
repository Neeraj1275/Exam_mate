export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileSize: number;
    totalPages: number;
    extractedText: string;
  };
}

export async function uploadPDF(file: File): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result: UploadResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "PDF upload failed");
  }

  return result;
}
