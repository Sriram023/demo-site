
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getHotels,
  deleteHotel,
} from "../services/hotelApi";

import HotelCard from "../components/HotelCard";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import DeleteConfirm from "../components/DeleteConfirm";
import SuccessPopup from "../components/SuccessPopup";

import "./HotelList.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function HotelList() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [hotelToDelete, setHotelToDelete] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const hotelsPerPage = 3;

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHotels();

        console.log("Backend response:", data);

        if (!data.success) {
          setError(
            data.message ||
              "Failed to load hotels."
          );
          return;
        }

        const formattedHotels =
          (data.hotels || []).map((hotel) => {
            let imageUrl = "";

            if (hotel.image) {
              
              if (
                hotel.image.startsWith("http")
              ) {
                imageUrl = hotel.image;
              }

              else if (
                hotel.image.startsWith("/")
              ) {
                imageUrl =
                  `${API_BASE_URL}${hotel.image}`;
              }

              else {
                imageUrl =
                  `${API_BASE_URL}/${hotel.image}`;
              }
            }

            return {
              ...hotel,
              price: Number(hotel.price),
              image: imageUrl,
            };
          });

        console.log(
          "Formatted hotels:",
          formattedHotels
        );

        setHotels(formattedHotels);
      } catch (error) {
        console.error(
          "GET HOTELS ERROR:",
          error
        );

        if (error.response) {
          setError(
            error.response.data?.message ||
              `Server error: ${error.response.status}`
          );
        } else if (error.request) {
          setError(
            "Backend server is not responding. Please start the server."
          );
        } else {
          setError(
            error.message ||
              "Failed to load hotels."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    minPrice,
    maxPrice,
  ]);

  const filteredHotels = hotels.filter(
    (hotel) => {
      const title =
        hotel.title || "";

      const price =
        Number(hotel.price) || 0;

      const searchMatch =
        title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const minMatch =
        minPrice === "" ||
        price >= Number(minPrice);

      const maxMatch =
        maxPrice === "" ||
        price <= Number(maxPrice);

      return (
        searchMatch &&
        minMatch &&
        maxMatch
      );
    }
  );

  const totalPages = Math.ceil(
    filteredHotels.length /
      hotelsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    hotelsPerPage;

  const currentHotels =
    filteredHotels.slice(
      startIndex,
      startIndex + hotelsPerPage
    );

  const handleDeleteClick = (hotel) => {
    setHotelToDelete(hotel);
  };

  const handleDeleteConfirm =
    async () => {
      if (!hotelToDelete) {
        return;
      }

      try {
        setError("");

        const response =
          await deleteHotel(
            hotelToDelete.id
          );

        console.log(
          "Delete response:",
          response
        );

        if (response.success) {
          const deletedTitle =
            hotelToDelete.title;

          setHotels(
            (previousHotels) =>
              previousHotels.filter(
                (hotel) =>
                  hotel.id !==
                  hotelToDelete.id
              )
          );

          setHotelToDelete(null);

          setSuccessMessage(
            `${deletedTitle} deleted successfully.`
          );

          if (
            currentHotels.length === 1 &&
            currentPage > 1
          ) {
            setCurrentPage(
              currentPage - 1
            );
          }
        } else {
          setError(
            response.message ||
              "Failed to delete hotel."
          );

          setHotelToDelete(null);
        }
      } catch (error) {
        console.error(
          "DELETE HOTEL ERROR:",
          error
        );

        setHotelToDelete(null);

        setError(
          error.response?.data
            ?.message ||
            error.message ||
            "Failed to delete hotel."
        );
      }
    };

  const handleDeleteCancel = () => {
    setHotelToDelete(null);
  };

  const handleSuccessClose = () => {
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <div className="hotel-list-page">
        <div className="loading-message">
          <h2>Loading hotels...</h2>
          <p>
            Connecting to the hotel server...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="hotel-list-page">
      <div className="hotel-header">
        <div>
          <h1>Our Hotels</h1>

          <p className="hotel-subtitle">
            Find the perfect stay for
            your journey
          </p>
        </div>

        <button
          type="button"
          className="add-hotel-button"
          onClick={() =>
            navigate("/add")
          }
        >
          + Add Hotel
        </button>
      </div>

     
      {error && (
        <div className="error-message">
          <strong>Error:</strong>{" "}
          {error}
        </div>
      )}

      
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      
      <p className="hotel-count">
        {filteredHotels.length} hotel
        {filteredHotels.length !== 1
          ? "s"
          : ""}{" "}
        found
      </p>

      
      {currentHotels.length > 0 ? (
        <div className="hotel-grid">
          {currentHotels.map(
            (hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onDelete={
                  handleDeleteClick
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="no-hotels">
          <h3>No hotels found</h3>

          <p>
            {hotels.length === 0
              ? "No hotels are available in the database yet."
              : "Try changing your search or price filters."}
          </p>
        </div>
      )}

      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={
            setCurrentPage
          }
        />
      )}

      <DeleteConfirm
        hotel={hotelToDelete}
        onConfirm={
          handleDeleteConfirm
        }
        onCancel={
          handleDeleteCancel
        }
      />

      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onClose={
            handleSuccessClose
          }
        />
      )}
    </div>
  );
}

export default HotelList;
