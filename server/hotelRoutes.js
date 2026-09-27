const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");

const router = express.Router();

const uploadFolder = path.join(
  __dirname,
  "uploads",
  "hotels"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});


router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM hotels ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      hotels: result.rows,
    });
  } catch (error) {
    console.error(
      "GET HOTELS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
      hotels: [],
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

    res.status(200).json({
      success: true,
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error(
      "GET HOTEL ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
    });
  }
});


router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        latitude,
        longitude,
        price,
      } = req.body;


      if (
        !title ||
        !description ||
        latitude === undefined ||
        longitude === undefined ||
        price === undefined ||
        !req.file
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields and image are required",
        });
      }

 

      if (
        isNaN(latitude) ||
        Number(latitude) < -90 ||
        Number(latitude) > 90
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Latitude must be between -90 and 90",
        });
      }


      if (
        isNaN(longitude) ||
        Number(longitude) < -180 ||
        Number(longitude) > 180
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Longitude must be between -180 and 180",
        });
      }


      if (
        isNaN(price) ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Price must be greater than 0",
        });
      }


      const image =
        `/uploads/hotels/${req.file.filename}`;


      const result = await db.query(
        `INSERT INTO hotels
        (
          title,
          description,
          latitude,
          longitude,
          price,
          image
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          title,
          description,
          latitude,
          longitude,
          price,
          image,
        ]
      );

      res.status(201).json({
        success: true,
        message:
          "Hotel added successfully",
        hotel: result.rows[0],
      });

    } catch (error) {
      console.error(
        "ADD HOTEL ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to add hotel",
      });
    }
  }
);


router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        latitude,
        longitude,
        price,
      } = req.body;


      const oldHotel =
        await db.query(
          "SELECT * FROM hotels WHERE id = $1",
          [req.params.id]
        );

      if (oldHotel.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }


      let image =
        oldHotel.rows[0].image;


      if (req.file) {
        image =
          `/uploads/hotels/${req.file.filename}`;
      }


      const result = await db.query(
        `UPDATE hotels
         SET
           title = $1,
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
          req.params.id,
        ]
      );

      res.status(200).json({
        success: true,
        message:
          "Hotel updated successfully",
        hotel: result.rows[0],
      });

    } catch (error) {
      console.error(
        "UPDATE HOTEL ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update hotel",
      });
    }
  }
);


router.delete(
  "/:id",
  async (req, res) => {
    try {


      const hotel =
        await db.query(
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

      res.status(200).json({
        success: true,
        message:
          "Hotel deleted successfully",
      });

    } catch (error) {
      console.error(
        "DELETE HOTEL ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete hotel",
      });
    }
  }
);


module.exports = router;