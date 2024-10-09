import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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
    setTimeout(() => {
      textFieldRef.current.focus();
    }, 0);
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
            Enter a keyword
          </Typography>
          <TextField
            id="keyword-input"
            label="Keyword"
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
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
