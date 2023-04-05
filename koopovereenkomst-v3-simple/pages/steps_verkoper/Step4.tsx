import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

export function Step4({ stepNr = 4, handleNext, handleBack = () => { } }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Aanmaken koopovereenkomst
      </Typography>

      <Stack direction="row" justifyContent="space-between">
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