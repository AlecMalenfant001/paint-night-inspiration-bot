import { Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { React, useState } from "react";
import { useUser } from "@clerk/clerk-react";
//import { head } from "../server/Routes/store";

export default function GenerateImageButton({
  addImgUrlFunc,
  addImgPromptFunc,
}) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  // Create AI generated image from description
  async function fetchImageFromGetImgAI() {
    setLoading(true); // Set loading to true while fetching

    // Get the API key from the environment
    let apiKey;
    let url;
    try {
      apiKey = import.meta.env.VITE_GETIMG_API_KEY;
      url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image";
    } catch (error) {
      setLoading(false);
      console.error("Error fetching getImg API key", error);
    }

    // Get the image description from the server
    let imgDescription;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/description`
      );
      imgDescription = response.data.description;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error while getting the image description from server",
        error
      );
    }

    // Get the prompt from the server
    let promptString;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/prompt`
      );
      promptString = response.data.prompt;
      console.log("prompt", promptString); // debug
    } catch (error) {
      console.error("Error while getting prompt from server: ", error);
    }

    // Create and retrieve the AI image
    try {
      // Getimg request body
      const body = JSON.stringify({
        prompt: promptString,
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

      const response = await fetch(url, options); // Make the API request

      // Handle non-2xx status codes
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      const generatedImgUrl = data.url;

      // Upload generated image to blob service for logged in uses
      let imgUrl = "";
      try {
        if (!user) {
          imgUrl = generatedImgUrl;
        } else {
          imgUrl = await uploadImagetoBlob(generatedImgUrl);
        }
      } catch (e) {
        console.error(
          "Error while uploading generated image to blob storage: ",
          e
        );
      }

      // Try to upload imgUrl to mongo database
      try {
        if (!user) {
          await uploadImageToMongo(imgUrl, promptString, "Anonymous");
        } else {
          await uploadImageToMongo(imgUrl, promptString, user.id);
        }
      } catch (e) {
        console.error("Image not saved to mongoDB: ", prompt, error);
      }

      addImgUrlFunc(imgUrl, promptString); // Return the new URL to the parent component
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error("Error fetching image:", error);
      setLoading(false); // Set loading to false
      return null; // Or handle the error differently
    }
  }

  async function uploadImageToMongo(img, prompt, name) {
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
        throw new Error("Failed to upload image data to mongoDB server.");
      }

      const { imgUrl } = await response.json();
      return imgUrl;
    } catch (error) {
      console.error("Error uploading image to mongoDB:", error);
      throw error;
    }
  }

  async function uploadImagetoBlob(generatedImgUrl) {
    // upload generated images to blob service
    /* input : 
          generatedImgUrl : string 
        output : 
          imgurl : string 
    */
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadGeneratedImage`,
        {
          imageUrl: generatedImgUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const imgUrl = response.data.url;
      return imgUrl;
    } catch (e) {
      console.error("Error uploading image to blob service", e);
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
            ✨ Generate Image
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
