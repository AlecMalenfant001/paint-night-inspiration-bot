import { Box, Button, CircularProgress } from "@mui/material";
import { React, useState } from "react";

export default function GenerateImageButton({ addImgUrlFunc }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // This function fetches an image from the GetImg AI API
  async function fetchImageFromGetImgAI() {
    setLoading(true); // Set loading to true while fetching

    // Get the API key from the environment
    const apiKey = import.meta.env.VITE_GETIMG_API_KEY;
    const url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";

    // Request Body
    const body = JSON.stringify({
      prompt: "a cat in a hat",
      width: 1024,
      height: 1024,
      output_format: "png",
      response_format: "url",
      model: "stable-diffusion-xl-v1-0",
    });

    // Request options
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    };

    // Try to fetch the image
    try {
      const response = await fetch(url, options); // Make the API request

      // Handle non-2xx status codes
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      addImgUrlFunc(data.url); // Return the new URL to the parent component
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching image:", error);
      return null; // Or handle the error differently
    }
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
    </>
  );
}
