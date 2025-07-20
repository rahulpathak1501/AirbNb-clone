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
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/properties`,
        {
          title,
          description,
          location,
          pricePerNight: price,
          numberOfGuests: guests,
          amenities: amenities.split(",").map((a) => a.trim()),
          images: [imageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("✅ Property listed successfully!");
        setTitle("");
        setDescription("");
        setLocation("");
        setPrice(0);
        setGuests(1);
        setAmenities("");
        setImageUrl("");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.msg || "❌ Failed to add property.");
    }
  };

  return (
    <form className="add-property-form" onSubmit={handleSubmit}>
      <h2>Add New Property</h2>

      <label htmlFor="title">Title</label>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="location">Location</label>
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <label htmlFor="price">Price Per Night</label>
      <input
        type="number"
        placeholder="Price Per Night"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        required
      />
      <label htmlFor="guests">Max Guests</label>
      <input
        type="number"
        placeholder="Max Guests"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        required
      />
      <label htmlFor="description">Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <label htmlFor="amenities">Amenities</label>
      <input
        type="text"
        placeholder="Amenities (comma separated)"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />

      <button type="submit">Add Property</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default AddPropertyForm;
