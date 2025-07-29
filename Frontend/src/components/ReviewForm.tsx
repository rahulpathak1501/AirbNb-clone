import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../style/ReviewForm.css";

type Props = {
  propertyId: string;
  onReviewSubmitted: () => void;
};

const ReviewForm: React.FC<Props> = ({ propertyId, onReviewSubmitted }) => {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrl = "http://localhost:5000";
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/reviews/${propertyId}`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Review submitted!");
      setRating(5);
      setComment("");
      onReviewSubmitted();
    } catch (err: any) {
      console.log("inside catch");
      toast.error(
        err.response?.data?.error || "Failed to submit review. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="review-form p-4 border rounded-xl space-y-4 shadow"
    >
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      <label className="block">
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 border px-2 py-1 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full mt-1 border rounded p-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
