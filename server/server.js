// This javascript server will handle uploading reference images to Azure blob storage
// to be used in the

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
const { BlobServiceClient } = require("@azure/storage-blob");
const multer = require("multer");
const upload = multer();
const port = 8080;

app.use(cors(corsOptions));

//create testing route for backend api
app.get("/api", (req, res) => {
  res.json({ fruits: ["Alec, Alex, Lili, Reagan, Troye Sivane"] });
});

// upload reference image to blob storage
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // retrieve the connection string from the .env file
    require("dotenv").config();
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

//run the server
app.listen(port, () => {
  console.log("Server running on port " + port);
});
