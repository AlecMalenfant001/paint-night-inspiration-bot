const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
router.use(express.json());

router.post("/imageGeneration", async (req, res) => {
  try {
    if (!req.body.imgUrl) {
      return res.status(400).json({ error: "imgUrl is required" });
    }

    const newImage = new Image({
      name:req.body.name,
      prompt:req.body.prompt,
      imgUrl: req.body.imgUrl,
    });

    const image = await newImage.save();
    res.status(201).json(image);
  } catch (error) {
    console.error("Error in image generation:", error); // Log any error
    res.status(500).json({ error: error.message });
  }
});

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



module.exports = router;
