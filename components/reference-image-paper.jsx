import React, { useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import ReferenceImageFooter from "./reference-img-footer";
import ImageDescription from "./scripts/imageDescription";
import { BlobServiceClient } from "@azure/storage-blob";

export default function ReferenceImagePaper() {
  const [image, setImage] = useState("https://via.placeholder.com/150");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imgDescription, setImgDescription] = useState("");
  const [descriptionConfidence, setDescriptionConfidence] = useState(0.0);

  const handleImageUpload = async (event) => {
    // this first async function is for the image upload
    const file = event.target.files[0];
    const filePath = event.target.value;
    console.log("File Path:", filePath);

    // Upload image to azure to get a publicly accessable url to the uploaded reference image
    uploadImageToAzure(
      filePath, //image path
      "referenceimages", //container name
      "blobfish0" //blob name
    ).then((url) => {
      console.log("Publicly accessible URL:", url);
    });

    // upload image to description API
    console.log("file", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // this second async function is for the image description
        const imageDataUrl = reader.result;
        console.log("imageDataUrl", imageDataUrl);
        setImage(imageDataUrl);
        setIsImageUploaded(true);

        // Create an instance of ImageDescription with the Data URL
        //const azureDescription = new ImageDescription(imageDataUrl);
        //await azureDescription.describeImage();

        // Temporary image URL
        const azureDescription = new ImageDescription(
          "https://www.kentpaulette.com/wp-content/uploads/moose-painting-art-antlers-bull-alces-elk-kent-paulette-1232x1536.jpg.webp"
        );
        await azureDescription.describeImage();

        // Update state with the description and confidence
        const descriptionText = azureDescription.getDescriptionText();
        const confidence = azureDescription.getDescriptionConfidence() * 100;
        console.log("Description Text:", descriptionText);
        console.log("Confidence:", confidence);

        setImgDescription(descriptionText);
        setDescriptionConfidence(confidence);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload the reference image to Azure Blob Storage
  async function uploadImageToAzure(imagePath, containerName, blobName) {
    try {
      const AZURE_STORAGE_CONNECTION_STRING = import.meta.env
        .VITE_STORAGE_CONNECTION_STRING;
      console.log("Azure Connection String:", AZURE_STORAGE_CONNECTION_STRING);
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadBlobResponse = await blockBlobClient.uploadFile(imagePath);
      console.log(
        `Upload block blob ${blobName} successfully`,
        uploadBlobResponse.requestId
      );

      // Get the URL of the uploaded image
      const imageUrl = blockBlobClient.url;
      console.log(`Image URL: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to Azure:", error);
      return null;
    }
  }

  /* Conditionally Render the image description and description confidence */
  function Footer({ isImageUploaded, descriptionConfidence, imgDescription }) {
    if (isImageUploaded) {
      return (
        <ReferenceImageFooter
          confidence={descriptionConfidence}
          description={imgDescription}
        />
      );
    }
    return null;
  }

  return (
    <Paper style={{ padding: 20, textAlign: "center", margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Reference Image
      </Typography>
      <img
        src={image}
        alt="Uploaded"
        style={{ width: "100%", height: "auto", marginBottom: 20 }}
      />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="upload-button-file"
        type="file"
        onChange={handleImageUpload}
      />
      <label htmlFor="upload-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload Image
        </Button>
      </label>
      <br />
      <Footer
        isImageUploaded={isImageUploaded}
        descriptionConfidence={descriptionConfidence}
        imgDescription={imgDescription}
      />
    </Paper>
  );
}
