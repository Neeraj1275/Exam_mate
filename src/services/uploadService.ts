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

  const responseText = await response.text();

  let result: UploadResponse;

  try {
    result = JSON.parse(responseText) as UploadResponse;
  } catch {
    throw new Error(
      `Server returned non-JSON response (${response.status}): ${responseText.slice(0, 300)}`,
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "PDF upload failed");
  }

  return result;
}
