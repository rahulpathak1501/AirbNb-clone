// src/components/ImageUploader.tsx
import React, { useState } from "react";
import axios from "axios";

type Props = {
  onUpload: (url: string) => void;
  defaultImage?: string;
};

const ImageUploader: React.FC<Props> = ({ onUpload, defaultImage }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(defaultImage || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onUpload(res.data.url); // send Cloudinary URL to parent
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded-md border"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default ImageUploader;
