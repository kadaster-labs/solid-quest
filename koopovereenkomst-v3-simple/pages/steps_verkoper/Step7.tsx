import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback } from "react";
import { getWebId } from "../../src/Solid";
import Events from "../../src/ui-components/Events";

export default function Step7({ stepNr = 6, handleBack = () => { }, navigateToMyKoeks: navigateToMyKoeks = () => { }, koek }) {

  const handleAkkoord = useCallback(async () => {
    let success = await koek.cmdHdlr.tekenen(getWebId());
    if (success == true) {
      navigateToMyKoeks();
    }
    else {
      throw new Error(`Tekenen niet gelukt! (check console voor errors)`);
    }
  }, [koek, /* navigateToMyKoeks */]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Tekenen koopovereenkomst <Typography variant="body1">#{koek.id}</Typography>
      </Typography>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={navigateToMyKoeks}>Mijn Koopovereenkomsten</Button>
        <Button variant="contained" onClick={handleAkkoord}>Akkoord</Button>
      </Stack>
    </Box>
  );
}
