import React from "react";

interface PaginationProps {
  listingsPerPage: number;
  totalListings: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  listingsPerPage,
  totalListings,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalListings / listingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === number ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
