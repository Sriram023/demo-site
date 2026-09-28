const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const db = require("./db");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hotel-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM hotels ORDER BY id DESC"
    );

    res.json({
      success: true,
      hotels: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM hotels WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.json({
      success: true,
      hotel: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
    });
  }
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    if (
      !title ||
      !description ||
      !latitude ||
      !longitude ||
      !price ||
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields and image are required",
      });
    }

    if (
      isNaN(latitude) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude",
      });
    }

    if (
      isNaN(longitude) ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude",
      });
    }

    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    const image = req.file.path;

    const result = await db.query(
      `INSERT INTO hotels
      (title, description, latitude, longitude, price, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        title,
        description,
        latitude,
        longitude,
        price,
        image
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hotel added successfully",
      hotel: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add hotel",
    });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    const oldHotel = await db.query(
      "SELECT * FROM hotels WHERE id = $1",
      [req.params.id]
    );

    if (oldHotel.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    let image = oldHotel.rows[0].image;

    if (req.file) {
      image = req.file.path;
    }

    const result = await db.query(
      `UPDATE hotels
       SET title = $1,
           description = $2,
           latitude = $3,
           longitude = $4,
           price = $5,
           image = $6
       WHERE id = $7
       RETURNING *`,
      [
        title,
        description,
        latitude,
        longitude,
        price,
        image,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: "Hotel updated successfully",
      hotel: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update hotel",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const hotel = await db.query(
      "SELECT * FROM hotels WHERE id = $1",
      [req.params.id]
    );

    if (hotel.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    await db.query(
      "DELETE FROM hotels WHERE id = $1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Hotel deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hotel",
    });
  }
});


module.exports = router;
