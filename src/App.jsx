import { useState, useEffect } from "react";
import "./App.css";
import GeminiTestButton from "../components/gemini-test";
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
  const [imageUrls, setImageUrls] = useState([
    "basquiatMoose.png",
    "frog2.png",
    "Glitch.png",
    "guillotine.png",
    "haringMoose.png",
  ]);

  const handleAddImage = (newUrl) => {
    console.log([...imageUrls, newUrl]);
    setImageUrls((imageUrls) => [newUrl, ...imageUrls]);
  };

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.fruits);
  };

  useEffect(() => {
    fetchAPI();
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
              <ImageGrid imageUrls={imageUrls} />
              <GeminiTestButton />
            </Box>
          </Stack>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
