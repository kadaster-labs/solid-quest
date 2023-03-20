import * as React from "react";
import Typography from "@mui/material/Typography";
import PodIcon from "../../src/PodIcon";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";

export default function Step2({ step = 2, handleNext, handleBack = () => { } }) {
  return (
    <Box>
      <Typography variant="h1" color="text.primary" align="center">
        Step {step + 1}
      </Typography>
      <Button variant="contained" onClick={handleBack}>Terug</Button>
      <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
    </Box>
  );
}
