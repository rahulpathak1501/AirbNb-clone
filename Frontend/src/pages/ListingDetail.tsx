import { useState, useEffect } from "react";
import { Property } from "../types/Property";
import { propertyApi } from "../apiServices/apiServices";
import PropertyCard from "../components/PropertyCard";
import Pagination from "./Pagination";
import MapView from "../components/MapView";

const ListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listingsPerPage = 6;
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = properties.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyApi.getAll({});
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

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
              <PropertyCard key={property._id} property={property} />
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
