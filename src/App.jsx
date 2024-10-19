import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import "./App.css";
import GeminiTestButton from "../components/gemini-test";
import AzureTestButton from "../components/azure-test";
import GetImgTestButton from "../components/test-getimg";
import ImageCarousel from "../components/image-carousel";
import ChipsArray from "../components/chip-array";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import {
  AppBar,
  Box,
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

const theme = createTheme({
  palette: {
    primary: {
      main: purple[900],
    },
    secondary: {
      main: pink[300],
    },
  },
});

export async function showImage(id) {
  const encodedId = encodeURIComponent(id);
  try {
    const response = await fetch(
      `https://ai-chat-2411.onrender.com/api/store/getImage/${encodedId}`
    );
``
    if (!response.ok) {
      const error = new Error("An error occurred while fetching the image");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const imageData = await response.json();
    return imageData;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [imageUrls, setImageUrls] = useState([
    "basquiatMoose.png",
    "frog2.png",
    "Glitch.png",
    "guillotine.png",
    "haringMoose.png",
  ]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      console.log("Checking fetch conditions...");
      if (isLoaded && isSignedIn && user) {
        console.log("User is signed in. Fetching images for:", user.firstName);
        try {
          const imageData = await showImage(user.firstName);

          // Extract URLs from fetched image data
          const fetchedUrls = imageData.map((image) => image.imgUrl);

          // Combine fetched images with sample images, with fetched images first
          setImageUrls((prevUrls) => [...fetchedUrls, ...prevUrls]);
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
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          bgcolor: theme.palette.secondary.main,
          height: "100%",
        }}
        disableGutters
      >
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

        <Stack
          direction={{ md: "column", lg: "row" }}
          alignItems="center"
          sx={{ m: 2 }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "70%", md: "80%", lg: "50%" },
              mx: 2,
            }}
          >
            <ReferenceImagePaper />
            <ChipsArray />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "70%", md: "80%", lg: "50%" },
              mx: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <SignedIn>
                <GenerateImageButton addImgUrlFunc={handleAddImage} />
              </SignedIn>
            </Box>
            {loadingImages ? (
              <p>Loading images...</p>
            ) : error ? (
              <p>Error loading images: {error}</p>
            ) : (
              <ImageGrid imageUrls={imageUrls} />
            )}
            <GeminiTestButton />
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
