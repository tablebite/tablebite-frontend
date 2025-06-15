// src/components/ImageUploader.jsx

import React, { useState, useEffect } from "react";

// your Cloudinary details
const cloudName    = "dnpfvqoq0";
const uploadPreset = "tablebite";

/** unsigned upload one file → secure_url */
async function uploadOne(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Upload failed");
  }
  const json = await res.json();
  return json.secure_url;
}

/**
 * @param {{ imageUrls?: string[], onChange: (newUrls:string[]) => void }} props
 */
export default function ImageUploader({ imageUrls = [], onChange }) {
  const [files,    setFiles]    = useState([]);    // selected File[]
  const [previews, setPreviews] = useState([]);    // blob URLs
  const [uploading, setUploading] = useState(false);
  const maxImages = 5;
  const placeholder =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  // build previews when `files` changes
  useEffect(() => {
    if (!files.length) return setPreviews([]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  // handle file‐input change, but cap at (maxImages – existing – previews)
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const allowed  = maxImages - imageUrls.length - previews.length;
    if (allowed <= 0) return;
    if (selected.length > allowed) {
      alert(`Only ${allowed} more image(s) allowed.`);
    }
    setFiles(selected.slice(0, allowed));
  };

  // upload all previews to Cloudinary
  const handleUpload = async () => {
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadOne));
      onChange([...imageUrls, ...urls]);
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // remove one existing URL
  const removeExisting = (url) => {
    onChange(imageUrls.filter((u) => u !== url));
  };
  // remove one preview
  const removePreview = (idx) => {
    const f = [...files];
    f.splice(idx, 1);
    setFiles(f);
    const p = [...previews];
    p.splice(idx, 1);
    setPreviews(p);
  };

  const total = imageUrls.length + previews.length;
  const atLimit = total >= maxImages;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {/* placeholder if nothing */}
        {total === 0 && (
          <img
            src={placeholder}
            alt="placeholder"
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        {/* existing images */}
        {imageUrls.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt=""
              className="w-16 h-16 object-cover rounded-md"
            />
            <button
              onClick={() => removeExisting(url)}
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 text-red-500 hover:bg-red-50"
            >
              ×
            </button>
          </div>
        ))}
        {/* preview images */}
        {previews.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt=""
              className="w-16 h-16 object-cover rounded-md opacity-80"
            />
            <button
              onClick={() => removePreview(i)}
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 text-red-500 hover:bg-red-50"
            >
              ×
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                …
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        disabled={atLimit}
        onChange={handleFileChange}
        className="mb-2"
      />
      {atLimit && (
        <p className="text-red-500 text-sm">Maximum of {maxImages} images reached</p>
      )}
      {!atLimit && files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload Images"}
        </button>
      )}
    </div>
  );
}
