import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Events from "../../src/ui-components/Events";

export default function Step7({ stepNr = 6, handleBack = () => { }, koek }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Tekenen koopovereenkomst
      </Typography>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>
          Terug
        </Button>
      </Stack>
    </Box>
  );
}
