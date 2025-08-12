import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import axios from "axios";
import "../style/AddPropertyForm.css";
import { propertyApi, uploadApi } from "../apiServices/apiServices";

const EditPropertyForm: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  // const apiUrl = "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: 0,
    numberOfGuests: 1,
    imageUrl: "",
    amenities: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertyApi.getById(id as string);
        const data = res.data;
        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          pricePerNight: data.pricePerNight,
          numberOfGuests: data.numberOfGuests,
          imageUrl: data.images?.[0] || data.imageUrl,
          amenities: data.amenities.join(", "),
        });
        setLoading(false);
      } catch (err) {
        console.error("Error loading property:", err);
        setMessage("Failed to load property.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formDataUpload = new FormData();
    formDataUpload.append("image", imageFile);

    const res = await uploadApi.uploadImage(imageFile);
    return res.data.url;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pricePerNight" || name === "numberOfGuests"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }
      if (!finalImageUrl || finalImageUrl.trim() === "") {
        setMessage("Please provide an image URL or upload a file.");
        return;
      }

      const token = localStorage.getItem("token");
      const data = {
        ...formData,
        images: [finalImageUrl],
        amenities: formData.amenities.split(",").map((a) => a.trim()),
      };
      await propertyApi.update(id, data);

      setMessage("Property updated successfully!");
      setTimeout(() => navigate("/host/dashboard"), 1000);
    } catch (err: any) {
      console.log(formData);
      console.error("Update failed:", err);
      setMessage(err.response?.data?.msg || "Failed to update property.");
    }
  };

  if (loading) return <p>Loading property...</p>;

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      <h2>Edit Property</h2>

      <label>Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Location</label>
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <label>Price Per Night</label>
      <input
        name="pricePerNight"
        type="number"
        value={formData.pricePerNight}
        onChange={handleChange}
        required
      />

      <label>Max Guests</label>
      <input
        name="numberOfGuests"
        type="number"
        value={formData.numberOfGuests}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <label>Amenities</label>
      <input
        name="amenities"
        placeholder="Comma separated"
        value={formData.amenities}
        onChange={handleChange}
      />

      <label>Image URL</label>
      <input
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
      />

      <label>Or Upload New Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />
      {imageFile && (
        <p style={{ color: "orange" }}>Uploaded image will override the URL.</p>
      )}

      <button type="submit">Update Property</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default EditPropertyForm;
