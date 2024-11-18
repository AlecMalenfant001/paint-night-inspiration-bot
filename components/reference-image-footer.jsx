import React, { useState } from "react";
import ConfidenceCircle from "./confidence-circle";
import { Box, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Grid2";

export default function ReferenceImageFooter(props) {
  //This function returns the image desctiption and image description confidence
  //at the bottom of the ReferenceImagePaper component
  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        {/*Headers*/}
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 5, sm: 7 }}>
            <Typography variant="h6">Description</Typography>
          </Grid>
          <Grid size={{ xs: 5, sm: 3 }}>
            <Typography variant="h6">Confidence</Typography>
          </Grid>
          <Grid size={{ xs: 2, sm: 2 }}>
            <Typography variant="h6">Delete</Typography>
          </Grid>
        </Grid>
        {/*Content*/}
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 5, sm: 7 }}>
            <Typography variant="body1">{props.description}</Typography>
          </Grid>
          <Grid size={{ xs: 5, sm: 3 }}>
            <ConfidenceCircle value={props.confidence} />
          </Grid>
          <Grid size={{ xs: 2, sm: 2 }}>
            <IconButton onClick={props.removeFunction}>
              <CancelIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
