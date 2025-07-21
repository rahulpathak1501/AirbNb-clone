import React, { useState } from "react";
import axios from "axios";
import "../style/AddPropertyForm.css";

const AddPropertyForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [guests, setGuests] = useState(1);
  const [amenities, setAmenities] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleImageUpload = async (): Promise<string | null> => {
    try {
      if (!imageFile) return null;

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axios.post(`${apiUrl}/api/upload`, formData);
      return res.data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      let finalImageUrl = imageUrl;

      if (!imageUrl && imageFile) {
        finalImageUrl = await handleImageUpload();
      }

      if (!finalImageUrl || finalImageUrl.trim() === "") {
        setMessage("Please provide an image URL or upload a file.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/properties`,
        {
          title,
          description,
          location,
          pricePerNight: price,
          numberOfGuests: guests,
          amenities: amenities
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a),
          images: [finalImageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Property listed successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setPrice(0);
        setGuests(1);
        setAmenities("");
        setImageUrl("");
        setImageFile(null);
      }
    } catch (err: any) {
      console.error("Property creation failed:", err);
      setMessage(err.response?.data?.msg || "Failed to add property.");
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
      ></textarea>

      <label>Amenities (comma separated)</label>
      <input
        type="text"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        required
      />

      <label>Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <label>Or Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <button type="submit">Add Property</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default AddPropertyForm;
