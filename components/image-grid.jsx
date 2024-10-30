import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useBreakpoint from "./scripts/useBreakPoint";
import { ImageListItemBar, Modal, Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import PromptModal from "./image-prompt-modal";

export default function ImageGrid(props) {
  // Opening / Closing functions for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imageUrls = props.imageUrls;
  const imagePrompts = props.imagePrompts;
  console.log("imageUrls: " + imageUrls);
  const breakpoint = useBreakpoint();
  const cols = {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  }[breakpoint];
  return (
    <ImageList sx={{ w: "100%" }} cols={cols}>
      {imageUrls.map((imageUrl, index) => (
        <ImageListItem key={index}>
          <img src={imageUrl} alt={imageUrl} loading="lazy" />
          <ImageListItemBar
            title={imagePrompts[index]}
            actionIcon={<PromptModal prompt={imagePrompts[index]} />}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
