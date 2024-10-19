import { useState, useEffect } from "react";
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

function App() {
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://ai-chat-2411.onrender.com/api/store/getImage"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          console.log("No images found.");
          return; // Do nothing if no images
        }

        const urls = data.map((item) => item.imgUrl);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error loading images:", error);
        setError(error.message);
      } finally {
        setLoadingImages(false); // Set loading to false once the fetch completes
      }
    };

    fetchImages();
  }, []);

  const handleAddImage = (newUrl) => {
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
              <GenerateImageButton addImgUrlFunc={handleAddImage} />
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
