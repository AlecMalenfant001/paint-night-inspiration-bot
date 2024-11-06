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
  CircularProgress,
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

// Fetch images based on the username
export async function fetchImages(username) {
  const encodedUsername = encodeURIComponent(username);
  try {
    const response = await fetch(
      `http://localhost:5000/api/store/getImage/${encodedUsername}`
    );
    if (!response.ok) {
      throw new Error("Error fetching images");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);

  // Function to load images
  const loadImages = async () => {
    if (isLoaded && isSignedIn && user) {
      try {
        setLoadingImages(true); // Start loading
        const images = await fetchImages(user.firstName);
        console.log(images);
        if (images.length > 0) {
          const formattedImages = images.map((img) => ({
            contentType: img.contentType,
            imgData: img.imgData,
            name: img.name,
          }));
          setImageUrls(formattedImages); // Set fetched images to state
        } else {
          setImageUrls([]); // Clear state if no images are found
        }
      } catch (err) {
        console.error("Error loading images:", err);
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoadingImages(false); // End loading
      }
    } else {
      setLoadingImages(false); // End loading if not signed in or not loaded
    }
  };

  useEffect(() => {
    loadImages(); // Call loadImages when component mounts or when user state changes
  }, [isLoaded, isSignedIn, user]);

  // Function to handle adding a new image
  const handleAddImage = (newImage) => {
    // Add the new image object to the beginning of the imageUrls state
    setImageUrls((prevUrls) => [...prevUrls, newImage]);
    loadImages();
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
              <GenerateImageButton addImgUrlFunc={handleAddImage} />
            </Box>
            {loadingImages ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px", // Adjust height as needed
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ textAlign: "center" }}>
                {error}
              </Typography>
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
