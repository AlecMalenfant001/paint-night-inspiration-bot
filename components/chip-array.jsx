import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddKeywordButton from "./add-keyword-button";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray() {
  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
  ]);

  const handleAdd = (chipToAdd) => {
    setChipData((chips) => [...chips, { key: chips.length, label: chipToAdd }]);
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        m: 0,
      }}
    >
      {/*Title and add button*/}
      <Typography variant="h6" align="center" gutterBottom>
        Keywords
      </Typography>
      <AddKeywordButton addKeywordFunction={handleAdd} />

      {/*List of Keywords*/}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 0,
        }}
        component="ul"
      >
        {/*Map array to chips*/}
        {chipData.map((data) => {
          let icon;

          if (data.label === "React") {
            icon = <TagFacesIcon />;
          }

          return (
            <ListItem key={data.key}>
              <Chip
                icon={icon}
                label={data.label}
                onDelete={
                  data.label === "React" ? undefined : handleDelete(data)
                }
              />
            </ListItem>
          );
        })}
      </Box>
    </Paper>
  );
}