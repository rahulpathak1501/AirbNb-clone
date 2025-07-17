import { useState } from "react";
import properties from "../data/properties";
// import ListingCard;
import PropertyCard from "../components/PropertyCard";
import Pagination from "./Pagination";
import MapView from "../components/MapView";

const ListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const listingsPerPage = 6;
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = properties.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Explore Stays</h2>
        <div className="space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded ${
              viewMode === "grid" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1 rounded ${
              viewMode === "map" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentListings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <Pagination
            listingsPerPage={listingsPerPage}
            totalListings={properties.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      ) : (
        <MapView properties={properties} />
      )}
    </div>
  );
};

export default ListingsPage;
