import { useState, useEffect } from "react";
import "./App.css";
import GeminiTestButton from "../components/gemini-test";
import ChipsArray from "../components/keywords";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
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

function App() {
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [error, setError] = useState(null);

  const handleAddImage = (newUrl) => {
    console.log([...imageUrls, newUrl]);
    setImageUrls((imageUrls) => [newUrl, ...imageUrls]);
  };

  useEffect(() => {
    const fetchImages = async () => {
      // If signed in, get images that have already been generated
      try {
        const response = await fetch(
          "https://ai-chat-2411.onrender.com/api/store/getImage"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
          console.err("Failed to fetch images: ", response.text);
        }

        const data = await response.json();

        if (data.length === 0) {
          console.log("No images found in mongoDB.");
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
                <ImageGrid imageUrls={imageUrls} />
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
