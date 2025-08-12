import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../style/ReviewList.css";
import { reviewApi } from "../apiServices/apiServices";
export type Review = {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; name: string };
  createdAt: string;
};

type Props = {
  reviews: Review[];
  avgRating: number;
  currentUserId: string;
  onRefresh: () => void;
};

const ReviewList: React.FC<Props> = ({
  reviews,
  avgRating,
  currentUserId,
  onRefresh,
}) => {
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewApi.deleteReview(id);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const handleEdit = (review: Review) => {
    setEditReviewId(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const handleUpdate = async () => {
    if (!editReviewId) return;
    try {
      await reviewApi.updateReview(editReviewId, {
        comment: editedComment,
        rating: editedRating,
      });
      setEditReviewId(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to update review", err);
    }
  };

  return (
    <div className="review-list mt-4">
      <h3 className="text-lg font-semibold">Reviews</h3>

      <div className="my-2 text-yellow-500 flex items-center gap-1">
        <FaStar /> <span>{avgRating.toFixed(1)} / 5</span>
      </div>

      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((review) => (
        <div key={review._id} className="review-item border-b py-2">
          {editReviewId === review._id ? (
            <div className="space-y-2">
              <div>
                <label className="block text-sm">Rating:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editedRating}
                  onChange={(e) => setEditedRating(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Comment:</label>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditReviewId(null)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {review.user?.name || "Anonymous"} ·{" "}
                  <FaStar className="inline text-yellow-400" /> {review.rating}
                </div>
                {review.user?._id === currentUserId && (
                  <div className="text-sm text-right space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1">{review.comment}</p>
              <small className="text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
