import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Events from "../../src/ui-components/Events";

export default function Step5({ stepNr = 5, handleNext, handleBack = () => { }, koek }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koopdetails
      </Typography>

      <Events koek={koek} />
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