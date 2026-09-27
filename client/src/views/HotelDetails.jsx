
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import hotel1 from "../assets/images/hotel1.jpeg";
import hotel2 from "../assets/images/hotel2.jpeg";
import hotel3 from "../assets/images/hotel3.jpeg";
import hotel4 from "../assets/images/hotel4.jpeg";
import hotel5 from "../assets/images/hotel5.jpeg";
import hotel6 from "../assets/images/hotel6.jpeg";

import "./HotelDetails.css";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  const hotels = [
    {
      id: 1,
      image: hotel1,
      title: "The Taj Mahal Palace",
      location: "Apollo Bunder, Colaba, Mumbai, Maharashtra",
      description:
        "A landmark luxury hotel overlooking the Gateway of India in Mumbai.",
      price: 25000,
      latitude: 18.921778,
      longitude: 72.833285,
    },

    {
      id: 2,
      image: hotel2,
      title: "ITC Grand Chola",
      location: "63, Anna Salai, Guindy, Chennai, Tamil Nadu",
      description:
        "A luxury hotel in Chennai inspired by the architectural heritage of the Chola dynasty.",
      price: 18000,
      latitude: 13.010574,
      longitude: 80.220194,
    },

    {
      id: 3,
      image: hotel3,
      title: "The Leela Palace Bengaluru",
      location: "23, Old Airport Road, Bengaluru, Karnataka",
      description:
        "A luxury palace-style hotel located on Old Airport Road in Bengaluru.",
      price: 22000,
      latitude: 12.960569,
      longitude: 77.648481,
    },

    {
      id: 4,
      image: hotel4,
      title: "Taj Falaknuma Palace",
      location: "Falaknuma, Hyderabad, Telangana",
      description:
        "A historic palace property offering a royal luxury experience in Hyderabad.",
      price: 30000,
      latitude: 17.33099,
      longitude: 78.46715,
    },

    {
      id: 5,
      image: hotel5,
      title: "The Oberoi Udaivilas",
      location: "Haridasji Ki Magri, Udaipur, Rajasthan",
      description:
        "A luxury resort overlooking Lake Pichola in the historic city of Udaipur.",
      price: 35000,
      latitude: 24.57718,
      longitude: 73.67253,
    },

    {
      id: 6,
      image: hotel6,
      title: "The Tamara Coorg",
      location: "Kabbinakad Estate, Yavakapadi, Coorg, Karnataka",
      description:
        "A nature-focused luxury resort surrounded by the hills and plantations of Coorg.",
      price: 16000,
      latitude: 12.22578,
      longitude: 75.64938,
    },
  ];

  useEffect(() => {
    const selectedHotel = hotels.find(
      (hotel) => hotel.id === Number(id)
    );

    setHotel(selectedHotel || null);
  }, [id]);

  if (!hotel) {
    return (
      <div className="hotel-details-page">

        <div className="hotel-not-found">

          <h2>Hotel Not Found</h2>

          <p>
            The hotel you are looking for does not exist.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Hotels
          </button>

        </div>

      </div>
    );
  }

  const mapUrl =
    `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=16&output=embed`;

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`,
      "_blank"
    );
  };

  return (
    <div className="hotel-details-page">

      <div className="hotel-details-container">

        {}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Hotels
        </button>

        {}
        <div className="details-heading">

          <h1>Hotel Details</h1>

          <p>
            View complete information about this hotel.
          </p>

        </div>

        {}
        <div className="hotel-details-card">

          
          <div className="details-image-container">

            <img
              src={hotel.image}
              alt={`${hotel.title} hotel`}
              className="details-image"
            />

          </div>

          <div className="hotel-info">

            <h2>{hotel.title}</h2>

            <div className="location-box">

              <span className="location-label">
                📍 Location
              </span>

              <p>{hotel.location}</p>

            </div>

            <div className="price-box">

              <span>
                Price per night
              </span>

              <strong>
                ₹{Number(hotel.price).toLocaleString("en-IN")}
              </strong>

            </div>

            <div className="details-section">

              <h3>Description</h3>

              <p>
                {hotel.description}
              </p>

            </div>

            <div className="details-section">

              <h3>Coordinates</h3>

              <div className="coordinates">

                <div>
                  <span>Latitude</span>

                  <strong>
                    {hotel.latitude}
                  </strong>
                </div>

                <div>
                  <span>Longitude</span>

                  <strong>
                    {hotel.longitude}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="map-section">

          <div className="map-heading">

            <div>

              <h2>Hotel Location</h2>

              <p>
                Map location based on the hotel's
                latitude and longitude.
              </p>

            </div>

            <button
              type="button"
              className="open-map-button"
              onClick={openGoogleMaps}
            >
              Open in Google Maps
            </button>

          </div>

          <div className="map-container">

            <iframe
              title={`${hotel.title} location map`}
              src={mapUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default HotelDetails;

