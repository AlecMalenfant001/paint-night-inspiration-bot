import { useState, useEffect } from "react";
import "./App.css";
import GeminiTestButton from "../components/gemini-test";
import ChipsArray from "../components/keywords";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Toolbar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";
import { pink, purple } from "@mui/material/colors";
import ReferenceImagePaper from "../components/reference-image-paper";
import ImageGrid from "../components/image-grid";
import GenerateImageButton from "../components/generate-img-button";
import axios from "axios";
import Footer from "../components/footer";

const theme = createTheme({
  palette: {
    primary: {
      main: purple[900],
    },
    secondary: {
      main: "#43304a",
      pink: pink[300],
    },
  },
});

export async function showImage(id) {
  const encodedId = encodeURIComponent(id);
  try {
    const response = await fetch(
      `https://ai-chat-2411.onrender.com/api/store/getImage/${encodedId}`
    );

    if (!response.ok) {
      const error = new Error("An error occurred while fetching the image");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const imageData = await response.json();
    console.log("imageData: ", imageData);
    return imageData;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePrompts, setImagePrompts] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log("Checking fetch conditions...");
      if (isLoaded && isSignedIn && user) {
        console.log("User is signed in. Fetching images for:", user.firstName);
        try {
          const imageData = await showImage(user.firstName);

          // Extract URLs and prompts from fetched image data
          const fetchedUrls = imageData.map((image) => image.imgUrl);
          const fetchedPrompts = imageData.map((image) => image.prompt);

          // Combine fetched images + prompts with sample images + prompts, with previous images first
          setImageUrls((prevUrls) => [...prevUrls, ...fetchedUrls]);
          setImagePrompts((prevPrompts) => [...prevPrompts, ...fetchedPrompts]);
        } catch (error) {
          console.error("Error loading images:", error);
          setError(error.message);
        } finally {
          setLoadingImages(false);
        }
      } else {
        // If not signed in, we can reset loading state
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [isLoaded, isSignedIn, user]);

  const handleAddImage = (newUrl) => {
    // Add the new URL to the beginning of the imageUrls state
    setImageUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {/*Wrapper*/}
        <Container
          sx={{
            bgcolor: theme.palette.secondary.main,
            height: "100%",
          }}
          disableGutters
        >
          {/*Title Bar*/}
          <Box sx={{ width: "100%" }}>
            <AppBar position="static" sx={{ width: "100%" }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Paint Night Inspiration Bot
                </Typography>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </Toolbar>
            </AppBar>
          </Box>

          {/*App Body*/}
          <Stack
            direction={{ md: "column", lg: "row" }}
            alignItems="center"
            sx={{ m: 2 }}
          >
            {" "}
            {/*Left / Top part of stack*/}
            <Box
              sx={{
                width: { xs: "100%", sm: "70%", md: "80%", lg: "50%" },
                mx: 2,
              }}
            >
              {/*Source Image*/}
              <ReferenceImagePaper />
              {/*Keywords*/}
              <ChipsArray />
            </Box>
            {/*Right / Bottom part of stack */}
            <Box
              sx={{
                width: { xs: "100%", sm: "70%", md: "80%", lg: "50%" },
                mx: 2,
              }}
            >
              {/*Generate Image Button*/}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <GenerateImageButton addImgUrlFunc={handleAddImage} />
              </Box>
              {loadingImages ? (
                <p>Loading images...</p>
              ) : error ? (
                <p>Error loading images: {error}</p>
              ) : (
                <ImageGrid imageUrls={imageUrls} imagePrompts={imagePrompts} />
              )}
            </Box>
          </Stack>
          {/* Footer */}
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
