import React, { useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import ReferenceImageFooter from "./reference-img-footer";
import ImageDescription from "./scripts/imageDescription";

export default function ReferenceImagePaper() {
  const [image, setImage] = useState("https://via.placeholder.com/150");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imgDescription, setImgDescription] = useState("");
  const [descriptionConfidence, setDescriptionConfidence] = useState(0.0);

  const handleImageUpload = async (event) => {
    // first async function is for the image upload
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // second async function is for the image description
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

  /* Conditionally Render the image description and description confidence */
  function Footer({ isImageUploaded, descriptionConfidence, imgDescription }) {
    console.log("Footer Props:", {
      isImageUploaded,
      descriptionConfidence,
      imgDescription,
    });
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
