import React, { useState } from "react";
import ConfidenceCircle from "./confidence-circle";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function ReferenceImageFooter(props) {
  //This function returns the image desctiption and image description confidence
  //at the bottom of the ReferenceImagePaper component
  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        {/*Headers*/}
        <Grid container spacing={2} columns={10}>
          <Grid size={7}>
            <Typography variant="h6">Description</Typography>
          </Grid>
          <Grid size={3}>
            <Typography variant="h6">Confidence</Typography>
          </Grid>
        </Grid>
        {/*Content*/}
        <Grid container spacing={2} columns={10}>
          <Grid size={7}>
            <Typography variant="body1">{props.description}</Typography>
          </Grid>
          <Grid size={3}>
            <ConfidenceCircle value={props.confidence} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
