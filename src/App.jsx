import { useState } from "react";
import "./App.css";
import GeminiTestButton from "../components/gemini-test";
import AzureTestButton from "../components/azure-test";
import GetImgTestButton from "../components/test-getimg";
import ImageCarousel from "../components/image-carousel";
import ChipsArray from "../components/chip-array";
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
  const [count, setCount] = useState(0);
  const imageUrls = [
    "basquiatMoose.png",
    "frog2.png",
    "Glitch.png",
    "guillotine.png",
    "haringMoose.png",
  ];

  return (
    <>
      <ThemeProvider theme={theme}>
        {/*Wrapper*/}
        <Container
          sx={{ bgcolor: theme.palette.secondary.main, height: "100vh" }}
          disableGutters
        >
          {/*Title Bar*/}
          <Box sx={{ width: "100%" }}>
            <AppBar position="static" sx={{ width: "100%" }}>
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Paint Night Inspiration Bot
                </Typography>
                <Button variant="outlined" color="inherit">
                  Login
                </Button>
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
              <GeminiTestButton />
              <AzureTestButton />
              <GetImgTestButton prompt="A cat in a hat" />

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
                <Button sx={{ m: 2 }} variant="contained">
                  Generate Image
                </Button>
              </Box>
              <ImageGrid imageUrls={imageUrls} />
            </Box>
          </Stack>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
