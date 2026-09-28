import { useNavigate } from "react-router-dom";

function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${hotel.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(hotel);
  };

  return (
    <div
      className="hotel-card"
      onClick={handleCardClick}
    >
      <div className="hotel-image-container">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.title}
            className="hotel-image"
          />
        ) : (
          <div className="no-image">
            No Image Available
          </div>
        )}
      </div>

      <div className="hotel-card-content">
        <h2 className="hotel-title">
          {hotel.title}
        </h2>

        <p className="hotel-description">
          {hotel.description}
        </p>

        <p className="hotel-price">
          ₹{Number(hotel.price).toLocaleString("en-IN")}
          <span> / night</span>
        </p>

        <div className="hotel-card-actions">
          <button
            type="button"
            className="edit-button"
            onClick={handleEdit}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
