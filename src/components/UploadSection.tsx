import { useRef, useState } from "react";
import { z } from "zod";

import { Upload, FileText, X } from "lucide-react";

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf"),
    "Only PDF files are allowed",
  )
  .refine(
    (file) => file.size <= 10 * 1024 * 1024,
    "File size must be less than 10 MB",
  );
function UploadSection() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const result = fileSchema.safeParse(file);

    if (!result.success) {
      setSelectedFile(null);
      setError(result.error.issues[0].message);
      event.target.value = "";
      return;
    }

    setSelectedFile(result.data);
    setError(null);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="upload-section">
      <div className="upload-heading">
        <div>
          <h2>Upload Question Papers</h2>
          <p>Upload previous-year question papers in PDF format.</p>
        </div>
      </div>

      <div className="upload-area">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <div className="upload-empty">
            <div className="upload-icon">
              <Upload size={25} />
            </div>

            <h3>Select your PDF paper</h3>

            <p>PDF files only · Maximum size 10 MB</p>

            <button
              type="button"
              className="primary-button"
              onClick={() => inputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="selected-file">
            <FileText size={25} />

            <div className="file-details">
              <strong>{selectedFile.name}</strong>

              <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>

            <button
              type="button"
              className="remove-button"
              onClick={handleRemoveFile}
              aria-label="Remove selected file"
            >
              <X size={19} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="upload-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default UploadSection;
