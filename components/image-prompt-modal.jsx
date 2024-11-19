import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

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

export default function PromptModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const prompt = props.prompt;
  const image = props.image;

  return (
    <Box>
      <IconButton
        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
        aria-label={`prompt`}
        onClick={handleOpen}
      >
        <InfoIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {prompt}
          </Typography>
          <Box sx={{ mt: 2, width: { xs: "80%", sm: 400 } }}>
            <img
              src={image}
              alt={"image of " + prompt}
              style={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
