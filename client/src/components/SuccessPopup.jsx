import "./SuccessPopup.css";

function SuccessPopup({
  message,
  onClose,
}) {
  return (
    <div className="success-popup">
      <div className="success-icon">
        ✓
      </div>

      <div className="success-content">
        <strong>Success</strong>

        <p>{message}</p>
      </div>

      <button
        type="button"
        className="success-close"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default SuccessPopup;