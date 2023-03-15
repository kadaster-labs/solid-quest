import * as React from "react";
import Typography from "@mui/material/Typography";
import PodIcon from "../../src/PodIcon";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Step1({ handleNext}) {

  return (
    <Box>
      <Typography variant="h1" color="text.primary" align="center">
        {"Start een nieuwe koopovereenkomst"}
      </Typography>
      <Typography variant="body1" color="text.primary" align="center">
        {
          "Om een koopovereenkomst te starten als verkoper, doorloop je verschillende stappen."
        }
      </Typography>
      <Typography variant="body1" color="text.primary" align="center">
        {"1. Log in met je WebID of mailadres"}
        <PodIcon sx={{ mx: "1rem", verticalAlign: "middle" }} />
      </Typography>
      <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
    </Box>
  );
}
