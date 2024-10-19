import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { React, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function GenerateImageButton({ addImgUrlFunc }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  async function fetchImageFromGetImgAI() {
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
      response_format: "url",
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
      const imgUrl = data.url;

      // Upload the image to the database
      await uploadImage(imgUrl, prompt, user.firstName);

      addImgUrlFunc(imgUrl);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching or uploading image:", error);
      setLoading(false);
      return null;
    }
  }

  async function uploadImage(img, prompt, name) {
    try {
      const response = await fetch(
        "https://ai-chat-2411.onrender.com/api/store/imageGeneration",
        {
          method: "POST",
          body: JSON.stringify({ imgUrl: img, prompt: prompt, name: name }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image data.");
      }

      const { imgUrl } = await response.json();
      return imgUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  return (
    <>
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
    </>
  );
}
