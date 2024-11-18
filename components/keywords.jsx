import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { Box, Typography } from "@mui/material";
import AddKeywordButton from "./add-keyword-button";
import axios from "axios";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray() {
  const [chipData, setChipData] = React.useState([]);

  const handleAdd = (chipToAdd) => {
    setChipData((chips) => {
      const updatedChips = [...chips, { key: chips.length, label: chipToAdd }];

      // Update keywords list on server
      const updateServer = async () => {
        try {
          await axios.post("http://localhost:8800/keywords", {
            keywords: updatedChips,
          });
        } catch (error) {
          console.error("Error updating keywords:", error);
        }
      };

      updateServer();
      console.log("updated server");

      return updatedChips;
    });
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );

    // Update keywords list on server
    const updateServer = async () => {
      try {
        await axios.post("http://localhost:8800/keywords", {
          keywords: chipData,
        });
      } catch (error) {
        console.error("Error updating keywords:", error);
      }
    };

    updateServer();
    console.log("updated server");

    return chipData;
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
        Input Text
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
