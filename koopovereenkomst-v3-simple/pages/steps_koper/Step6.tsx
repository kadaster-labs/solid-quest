import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Events from "../../src/ui-components/Events";

export default function Step6({ stepNr = 5, handleBack = () => { }, navigateToMyKoeks: navigateToMyKoeks = () => { }, koek }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Ik wil een huis kopen
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Inschrijving bij het Kadaster
      </Typography>

      <Typography variant="body1" color="text.primary" align="center">
        Als koper kun je meer bescherming krijgen bij faillissement van de verkoper door de koopovereenkomst in te schrijven bij het Kadaster.
      </Typography>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={navigateToMyKoeks}>Deelnemen Koopovereenkomst</Button>
      </Stack>
    </Box>
  );
}
