import React, { useState } from "react";
import { Paper, Typography, Button, CircularProgress } from "@mui/material";
import ReferenceImageFooter from "./reference-img-footer";
import ImageCaptions from "./scripts/imageCaptions";
import axios from "axios";

export default function ReferenceImagePaper() {
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
  );
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imgDescription, setImgDescription] = useState("");
  const [descriptionConfidence, setDescriptionConfidence] = useState(0.0);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    // this first async function is for the image upload

    // Get the file from the event
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true); // Set loading to true while fetching

    // upload image to APIs
    try {
      // upload image to Azure Blob Storage to get publicly accessible URL of uploaded image
      const response = await fetch("http://localhost:8800/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const publicUrl = data.url;
      console.log("Publicly accessible URL:", publicUrl);

      // upload image to description API
      console.log("file", file);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Get image data
          const imageDataUrl = reader.result;
          console.log("imageDataUrl", imageDataUrl);
          setImage(imageDataUrl);
          setIsImageUploaded(true);

          console.log("Public URL:", publicUrl); // debug

          // Create an instance of ImageCaptions with the public url
          const azureCaptions = new ImageCaptions(publicUrl);
          await azureCaptions.captionImage();

          // Update state with the description and confidence
          const descriptionText = azureCaptions.descriptionText;
          const confidence = azureCaptions.descriptionConfidence * 100;
          setImgDescription(descriptionText);
          setDescriptionConfidence(confidence);

          // Update server with image description to be used by genrate image button
          const response = await axios.post(
            "http://localhost:8800/description",
            { description: descriptionText },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setLoading(false);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

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

  // UI elements
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
        <Button
          variant="contained"
          color="primary"
          component="span"
          disabled={loading}
        >
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
