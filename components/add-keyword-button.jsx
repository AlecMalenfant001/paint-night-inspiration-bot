// This component contains both the button and modal for adding keywords
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import randomWord from "./scripts/randomWord.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", sm: 400 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddKeywordButton({ addKeywordFunction }) {
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const textFieldRef = React.useRef(null);

  const handleOpen = () => {
    setKeyword("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleKeywordChange = (event) => setKeyword(event.target.value);
  const handleSubmit = () => {
    addKeywordFunction(keyword);
    handleClose();
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  // A function to fill the textfield with a random noun, adjective, or verb
  const addRandom = (wordType) => {
    setKeyword(randomWord(wordType));
    return;
  };

  return (
    <div>
      <IconButton aria-label="add" size="small" onClick={handleOpen}>
        <AddIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            New Text Input
          </Typography>
          <TextField
            id="keyword-input"
            label="Word or Phrase"
            variant="outlined"
            fullWidth
            value={keyword}
            onChange={handleKeywordChange}
            margin="normal"
            onKeyDown={handleKeyPress}
            inputRef={textFieldRef}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
          <Stack sx={{ mt: 3 }} spacing={1.5}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                addRandom("noun");
              }}
            >
              Random Noun
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                addRandom("adjective");
              }}
            >
              Random Adjective
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                addRandom("verb");
              }}
            >
              Random Verb
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
