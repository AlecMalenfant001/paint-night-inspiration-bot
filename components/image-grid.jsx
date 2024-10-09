import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useBreakpoint from "./scripts/useBreakPoint";

export default function ImageGrid(props) {
  const imageUrls = props.imageUrls;
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
          <img
            srcSet={`${imageUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${imageUrl}?w=164&h=164&fit=crop&auto=format`}
            alt={imageUrl}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
