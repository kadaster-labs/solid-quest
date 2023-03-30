import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";

export function Step5({ step = 5, handleNext, handleBack = () => {} }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {step}. Aanmaken koopovereenkomst
      </Typography>

      <Stack direction="row" justifyContent="end">
        <Button variant="contained" onClick={handleBack}>
          Terug
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Doorgaan
        </Button>
      </Stack>
    </Box>
  );
}
