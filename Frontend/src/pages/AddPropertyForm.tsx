import React, { useState } from "react";
import axios from "axios";
import "../style/AddPropertyForm.css";
import { propertyApi } from "../apiServices/apiServices";

const AddPropertyForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [guests, setGuests] = useState(1);
  const [amenities, setAmenities] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const handleImageUpload = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post(`${apiUrl}/upload`, formData);
        uploadedUrls.push(res.data.url);
      } catch (err) {
        console.error("Upload failed for:", file.name, err);
        setMessage("One or more image uploads failed.");
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    let finalImageUrls = [...imageUrls];

    if (imageFiles.length > 0) {
      const uploaded = await handleImageUpload();
      finalImageUrls = finalImageUrls.concat(uploaded);
    }

    if (finalImageUrls.length === 0) {
      setMessage("Please provide at least one image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = {
        title,
        description,
        location,
        pricePerNight: price,
        numberOfGuests: guests,
        amenities: amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images: finalImageUrls,
      };
      const res = await propertyApi.create(data);

      if (res.status === 201) {
        setMessage("Property listed successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setPrice(0);
        setGuests(1);
        setAmenities("");
        setImageUrls([]);
        setImageFiles([]);
      }
    } catch (err: any) {
      console.error("Property creation failed:", err);
      setMessage(err.res?.data?.msg || "Failed to add property.");
    }
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      <h2>Add New Property</h2>

      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <label>Price Per Night</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        required
      />

      <label>Max Guests</label>
      <input
        type="number"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        required
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <label>Amenities (comma separated)</label>
      <input
        type="text"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        required
      />

      <label>Image URLs (comma separated)</label>
      <input
        type="text"
        value={imageUrls.join(",")}
        onChange={(e) =>
          setImageUrls(
            e.target.value
              .split(",")
              .map((url) => url.trim())
              .filter(Boolean)
          )
        }
      />

      <label>Or Upload Multiple Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
      />

      <button type="submit">Add Property</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default AddPropertyForm;
