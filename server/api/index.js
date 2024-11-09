// This javascript server will handle uploading reference images to Azure blob storage
// to be used in the

const { BlobServiceClient } = require("@azure/storage-blob");
const axios = require("axios");

// setup access to environment variables
require("dotenv").config();

// setup multer to handle file uploads
const multer = require("multer");
const upload = multer();

// setup express app
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

// setup cross object reference
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// port number for this server
const port = 3000;

// upload reference image to blob storage
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // retrieve the connection string from the .env file
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_STORAGE_CONNECTION_STRING;

    // get file name from request body
    console.log("req.file", req.file);
    const fileName = req.file.originalname;

    // create a new BlobServiceClient and ContainerClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // upload the image to Azure Blob Storage
    const buffer = req.file.buffer;
    await blockBlobClient.uploadData(buffer);

    // return the URL of the uploaded image
    const url = blockBlobClient.url;
    res.json({ url });
  } catch (error) {
    res.status(500).send("Error uploading image to Azure: " + error.message);
  }
});

app.post("/uploadGeneratedImage", async (req, res) => {
  try {
    // retrieve the connection string from the .env file
    const AZURE_STORAGE_CONNECTION_STRING =
      process.env.AZURE_STORAGE_CONNECTION_STRING;

    // get image URL from request body
    const imageUrl = req.body.imageUrl;
    const fileName = imageUrl.split("/").pop();

    // fetch the image data from the public URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // create a new BlobServiceClient and ContainerClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // upload the image to Azure Blob Storage
    await blockBlobClient.uploadData(buffer);

    // return the URL of the uploaded image
    const url = blockBlobClient.url;
    res.json({ url });
  } catch (error) {
    res
      .status(500)
      .send("Error uploading generated image to Azure: " + error.message);
  }
});

//Image Description
let imgDescription = "";
app.post("/description", (req, res) => {
  // Set image description
  try {
    imgDescription = req.body.description;
    if (typeof imgDescription != "undefined") {
      // Success
      res
        .status(200)
        .send("Image description set successfully: " + imgDescription);
    } else {
      // Error : imgDescription undefined
      res
        .status(500)
        .send("Error settting image description: description is undefined");
    }
  } catch (error) {
    res.status(500).send("Error setting image description: " + error.message);
  }
});
app.get("/description", (req, res) => {
  // Get image description
  try {
    console.log("imgDescription: ", imgDescription);
    res.status(200).json({ description: imgDescription });
  } catch (error) {
    res.status(500).send("Error getting image description: " + error.message);
  }
});

//Keywords
let keywordsList = [];
app.post("/keywords", (req, res) => {
  try {
    // Add new keyword to keyword list
    keywordsList = req.body.keywords;
    res.status(200).send("update keywords sucessful");
    console.log("KeywordsList: ", keywordsList);
  } catch (error) {
    res.status(500).send("Server Error : Error updating keywords : " + error);
  }
});
app.get("/keywords", (req, res) => {
  try {
    //return keyword list
    res.status(200).json({ keywords: keywordsList });
  } catch (error) {
    res.status(500).send("Server Error : Error getting keywords " + error);
  }
});

// Current Prompt
let promptString = "";
app.get("/prompt", (req, res) => {
  try {
    // Extract labels from keywordsList
    let labels = keywordsList.map((keyword) => keyword.label);

    // Concatenate imgDescription with labels
    promptString = "A painting of " + imgDescription + " " + labels.join(" ");
    console.log("promptString: ", promptString);
    res.status(200).json({ prompt: promptString });
  } catch (error) {
    res.status(500).send("Erorr while getting prompt from server" + error);
  }
});

// Mongoose Database
const mongoose = require("mongoose");
const authRoute = require("./../Routes/store");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/store", authRoute);

//run the server
app.listen(port, () => {
  console.log("Server running on port " + port);
});
