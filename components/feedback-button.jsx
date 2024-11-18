import React, { useRef, useState } from "react";
import { Box, Button, IconButton, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCommentIcon from "@mui/icons-material/AddComment";
import emailjs from "@emailjs/browser";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          console.log("Feedback Sent");
          handleClose();
          e.target.reset(); // clear the form
          setLoading(false);
        },
        (error) => {
          console.log("Failed to send feedback ", error.text);
          setLoading(false);
        }
      );
  };

  return (
    <React.Fragment>
      <IconButton size="large" color="secondary" onClick={handleClickOpen}>
        <AddCommentIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for giving feedback. Please describe any issue or
            suggestion in detail. Contact information is optional
          </DialogContentText>
          <Box
            component="form"
            ref={form}
            sx={{ "& .MuiTextField-root": { my: 1 } }}
            onSubmit={sendEmail}
          >
            <div>
              <TextField
                fullWidth
                id="user_name"
                name="user_name"
                label="Name"
              />
            </div>
            <div>
              <TextField
                fullWidth
                id="user_email"
                name="user_email"
                label="Email"
              />
            </div>
            <div>
              <TextField
                fullWidth
                multiline
                required
                id="message"
                label="Message"
                name="message"
              />
            </div>
            <DialogActions>
              <Button type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
