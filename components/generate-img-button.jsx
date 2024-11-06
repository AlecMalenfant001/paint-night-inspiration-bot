// generate-img-button.js

import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function GenerateImageButton({ addImgUrlFunc }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(false);
  const { isSignedIn, user } = useUser();

const fetchImageFromGetImgAI = async () => {

  if (!prompt.trim()) {
    setError(true);
    return;
  }

  setLoading(true);
  setError(false);

  const apiKey = import.meta.env.VITE_GETIMG_API_KEY;
  const url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";

  const body = JSON.stringify({
    prompt: prompt,
    width: 1024,
    height: 1024,
    output_format: "png",
    response_format: "b64", 
    model: "stable-diffusion-xl-v1-0",
  });

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data); 

    
    const imgBase64 = data.image; 
    if (!imgBase64) {
      console.error("Image data not found in response:", data);
      return;
    }

    const generatedImage = `data:image/png;base64,${imgBase64}`;
    console.log(generatedImage);
    addImgUrlFunc(generatedImage);

    uploadImage(imgBase64);
  } catch (error) {
    console.error("Error fetching or uploading image:", error);
  } finally {
    setLoading(false);
  }
};


  const uploadImage = async (imageData) => {
    const payload = {
      name: user?.firstName || "GeneratedImage",
      prompt: prompt,
      imgData: imageData,
      contentType: "image/png",
    };

    try {
      const response = await fetch(
        "https://ai-chat-2411.onrender.com/api/store/imageGeneration",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const responseBody = await response.json();
        console.error("Upload failed with response:", responseBody);
        throw new Error(`Upload failed: ${responseBody.error}`);
      }

      const result = await response.json();
      console.log("Image uploaded successfully:", result);

      
      addImgUrlFunc(`data:image/png;base64,${result.imgData}`);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TextField
        sx={{ m: 2, width: "300px" }}
        label="Enter image prompt"
        variant="outlined"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        error={error}
        helperText={error ? "Prompt cannot be empty" : ""}
      />
      <Box sx={{ m: 1, position: "relative" }}>
        <Button
          sx={{ m: 2 }}
          variant="contained"
          disabled={loading}
          onClick={fetchImageFromGetImgAI}
        >
          Generate Image
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: "green",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Box>
  );
}
