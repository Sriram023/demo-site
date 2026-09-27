import "./DeleteConfirm.css";

function DeleteConfirm({ hotel, onConfirm, onCancel }) {
  if (!hotel) {
    return null;
  }

  return (
    <div className="delete-overlay">
      <div className="delete-modal">

        <div className="delete-icon">
          ⚠️
        </div>

        <h2>Delete Hotel?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{hotel.title}</strong>?
        </p>

        <p className="delete-warning">
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">

          <button
            type="button"
            className="cancel-delete-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete-button"
            onClick={onConfirm}
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;