/* This script stores generated images to a mongodb database so that logged in users can access them again */

const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
router.use(express.json());

//Store Generated Image
router.post("/imageGeneration", async (req, res) => {
  console.log("Request body:", req.body); // debug
  try {
    if (!req.body.imgUrl) {
      return res.status(400).json({ error: "imgUrl is required" });
    }

    const newImage = new Image({
      name: req.body.name,
      prompt: req.body.prompt,
      imgUrl: req.body.imgUrl,
    });

    const image = await newImage.save();
    res.status(201).json(image);
  } catch (error) {
    console.error("Error in image generation:", error); // Log any error
    res.status(500).json({ error: error.message });
  }
});

// Get Stored Images
router.get("/getImage", async (req, res) => {
  try {
    const images = await Image.find();
    if (images.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }
    res.status(200).json(images); // This will return an array of image objects
  } catch (err) {
    res.status(500).json({ error: "Error fetching images", details: err });
  }
});

// Get Images by User ID
router.get("/getImage/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const images = await Image.find({ name: userId }); // Fetch images for the specific user

    if (images.length === 0) {
      return res.status(404).json({ message: "No images found for this user" });
    }

    res.status(200).json(images); // Return the user's images
  } catch (err) {
    res.status(500).json({ error: "Error fetching images", details: err });
  }
});

module.exports = router;
