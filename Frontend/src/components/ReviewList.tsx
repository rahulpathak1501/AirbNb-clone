import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
};

const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  return (
    <div className="review-list">
      <h3>Reviews</h3>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div>
            <strong>{review.user.name}</strong> · <FaStar color="#fbbf24" />{" "}
            {review.rating}
          </div>
          <p>{review.comment}</p>
          <small>{new Date(review.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
