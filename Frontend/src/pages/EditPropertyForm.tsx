import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/AddPropertyForm.css"; // reuse same styles as AddPropertyForm

const EditPropertyForm: React.FC = () => {
  const { id } = useParams(); // URL param: /host/edit/:id
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/properties/${id}`);
        const data = res.data;

        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          pricePerNight: data.pricePerNight,
          numberOfGuests: data.numberOfGuests,
          imageUrl: data.imageUrl,
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
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/properties/${id}`,
        {
          ...formData,
          amenities: formData.amenities.split(",").map((a) => a.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Property updated successfully!");
      setTimeout(() => navigate("/host/dashboard"), 1000);
    } catch (err: any) {
      console.error("Update failed:", err);
      setMessage(err.response?.data?.msg || "❌ Failed to update property.");
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
        placeholder="Comma separated (e.g. WiFi, AC, Pool)"
        value={formData.amenities}
        onChange={handleChange}
      />

      <label>Image URL</label>
      <input
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        required
      />

      <button type="submit">Update Property</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default EditPropertyForm;
