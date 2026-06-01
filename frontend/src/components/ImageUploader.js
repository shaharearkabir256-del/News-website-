import React, { useRef, useState } from "react";
import { adminApi, resolveImageUrl } from "@/api";
import { IconUpload } from "@/components/Icons";

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      onChange(res.url);
    } catch (err) {
      setError(err?.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUrlChange = (e) => onChange(e.target.value);

  return (
    <div className="image-uploader">
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          className="admin-form__input"
          value={value || ""}
          onChange={handleUrlChange}
          placeholder="https://... or upload below"
          data-testid="admin-image-url"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-testid="admin-upload-btn"
          style={{ whiteSpace: "nowrap" }}
        >
          <IconUpload /> {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>
      {error && (
        <div style={{ marginTop: 6, color: "var(--color-accent-primary)", fontSize: "var(--text-xs)" }}>{error}</div>
      )}
      <div style={{ marginTop: 4, fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-family-ui)" }}>
        Uploaded images are converted to WebP, resized to max 800px width, quality 75.
      </div>
      {value ? (
        <img
          src={resolveImageUrl(value)}
          alt="Preview"
          style={{ marginTop: 12, maxHeight: 200, borderRadius: 4, objectFit: "cover", border: "1px solid var(--color-border-default)" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : null}
    </div>
  );
}
