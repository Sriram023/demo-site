import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  addHotel,
  getHotelById,
  updateHotel,
} from "../services/hotelApi";

import "./HotelFormPage.css";

const API_BASE_URL = "http://localhost:5000";

function HotelFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);


  useEffect(() => {
    if (!isEditMode) return;

    const loadHotel = async () => {
      try {
        setPageLoading(true);

        const data = await getHotelById(id);

        if (data.success) {
          const hotel = data.hotel;

          setFormData({
            title: hotel.title || "",
            description: hotel.description || "",
            latitude: hotel.latitude || "",
            longitude: hotel.longitude || "",
            price: hotel.price || "",
          });

          if (hotel.image) {
            setImagePreview(
              `${API_BASE_URL}${hotel.image}`
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load hotel:",
          error
        );

        alert("Failed to load hotel details.");

        navigate("/");
      } finally {
        setPageLoading(false);
      }
    };

    loadHotel();
  }, [id, isEditMode, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    setImage(selectedImage);

    setImagePreview(
      URL.createObjectURL(selectedImage)
    );

    setErrors((previousErrors) => ({
      ...previousErrors,
      image: "",
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Hotel title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Hotel description is required.";
    }

    if (!formData.latitude) {
      newErrors.latitude =
        "Latitude is required.";
    } else if (
      isNaN(formData.latitude) ||
      Number(formData.latitude) < -90 ||
      Number(formData.latitude) > 90
    ) {
      newErrors.latitude =
        "Latitude must be between -90 and 90.";
    }

    if (!formData.longitude) {
      newErrors.longitude =
        "Longitude is required.";
    } else if (
      isNaN(formData.longitude) ||
      Number(formData.longitude) < -180 ||
      Number(formData.longitude) > 180
    ) {
      newErrors.longitude =
        "Longitude must be between -180 and 180.";
    }

    if (!formData.price) {
      newErrors.price =
        "Price is required.";
    } else if (
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price =
        "Price must be greater than 0.";
    }


    if (!isEditMode && !image) {
      newErrors.image =
        "Hotel image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "latitude",
        formData.latitude
      );

      data.append(
        "longitude",
        formData.longitude
      );

      data.append(
        "price",
        formData.price
      );

      if (image) {
        data.append("image", image);
      }
      if (isEditMode) {

        const response =
          await updateHotel(id, data);

        if (response.success) {
          alert(
            "Hotel updated successfully!"
          );

          navigate("/");
        }

      } else {

        const response =
          await addHotel(data);

        if (response.success) {
          alert(
            "Hotel added successfully!"
          );

          navigate("/");
        }
      }

    } catch (error) {

      console.error(
        "Save hotel error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to save hotel.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };



  const handleCancel = () => {
    navigate("/");
  };

  if (pageLoading) {
    return (
      <div className="hotel-form-page">

        <div className="hotel-form-container">

          <h2>
            Loading hotel...
          </h2>

        </div>

      </div>
    );
  }


  return (
    <div className="hotel-form-page">

      <div className="hotel-form-container">

        <div className="form-header">

          <h1>
            {isEditMode
              ? "Edit Hotel"
              : "Add New Hotel"}
          </h1>

          <p>
            {isEditMode
              ? "Update the hotel information below."
              : "Enter the details to add a new hotel."}
          </p>

        </div>

        <form
          className="hotel-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Hotel Image
              <span className="required">
                *
              </span>
            </label>

            <div className="image-upload-area">

              {imagePreview ? (

                <div className="image-preview-container">

                  <img
                    src={imagePreview}
                    alt="Hotel preview"
                    className="image-preview"
                  />

                  <label
                    htmlFor="hotel-image"
                    className="change-image-button"
                  >
                    Change Image
                  </label>

                </div>

              ) : (

                <label
                  htmlFor="hotel-image"
                  className="upload-box"
                >

                  <span className="upload-icon">
                    
                  </span>

                  <span className="upload-title">
                    
                  </span>

                  <span className="upload-text">
                    Click to choose an image
                  </span>

                </label>

              )}

              <input
                id="hotel-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </div>

            {errors.image && (

              <p className="error-message">
                {errors.image}
              </p>

            )}

          </div>

          <div className="form-group">

            <label htmlFor="title">
              Hotel Title
              <span className="required">
                *
              </span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter hotel name"
              value={formData.title}
              onChange={handleChange}
            />

            {errors.title && (

              <p className="error-message">
                {errors.title}
              </p>

            )}

          </div>

          <div className="form-group">

            <label htmlFor="description">
              Description
              <span className="required">
                *
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Enter hotel description"
              value={formData.description}
              onChange={handleChange}
            />

            {errors.description && (

              <p className="error-message">
                {errors.description}
              </p>

            )}

          </div>

          <div className="location-row">

            <div className="form-group">

              <label htmlFor="latitude">
                Latitude
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                placeholder="Example: 13.010574"
                value={formData.latitude}
                onChange={handleChange}
              />

              {errors.latitude && (

                <p className="error-message">
                  {errors.latitude}
                </p>

              )}

            </div>

            <div className="form-group">

              <label htmlFor="longitude">
                Longitude
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                placeholder="Example: 80.220194"
                value={formData.longitude}
                onChange={handleChange}
              />

              {errors.longitude && (

                <p className="error-message">
                  {errors.longitude}
                </p>

              )}

            </div>

          </div>

          <div className="form-group">

            <label htmlFor="price">
              Price per Night
              <span className="required">
                *
              </span>
            </label>

            <div className="price-input">

              <span>₹</span>

              <input
                id="price"
                name="price"
                type="number"
                min="1"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
              />

            </div>

            {errors.price && (

              <p className="error-message">
                {errors.price}
              </p>

            )}

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Hotel"
                : "Add Hotel"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default HotelFormPage;