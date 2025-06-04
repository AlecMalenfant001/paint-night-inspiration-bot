import { Button } from "@mui/material";
import React from "react";

export default function GetImgTestButton({ promptText }) {
  async function fetchImageFromGetImgAI() {
    const apiKey = import.meta.env.VITE_GETIMG_API_KEY;
    const url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";
    const body = JSON.stringify({
      prompt: "a cat in a hat",
      width: 512,
      height: 512,
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
      // Make the API request
      const response = await fetch(url, options);

      // Handle non-2xx status codes
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      // Parse the JSON response
      const data = await response.json();
      console.log("image url: ", data.url);
    } catch (error) {
      console.error("Error fetching image:", error);
      return null; // Or handle the error differently
    }
  }

  //return <button onClick={fetchImageFromGetImgAI}>Test Getimg API</button>;
  return (
    <Button variant="contained" onClick={fetchImageFromGetImgAI}>
      Test Getimg API
    </Button>
  );
}
