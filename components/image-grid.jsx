import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export default function ImageGrid(props) {
  const { imageUrls } = props;

  return (
    <ImageList sx={{ width: "100%" }} cols={3}>
      {imageUrls.map((image, index) => {
        const contentType = image.contentType || "image/jpeg"; 
        const imgData = image.imgData || ""; 

        
        if (!imgData) {
          return null;
        }

        return (
          <ImageListItem key={index}>
            <img
              src={`data:${contentType};base64,${imgData}`}
              alt={image.name || `Image ${index + 1}`}
              loading="lazy"
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
