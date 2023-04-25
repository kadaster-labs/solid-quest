import { Box, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import KoekAggregate from "../../src/koek/KoekAggregate";
import Events from "../../src/ui-components/Events";


interface Step2Props {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  selectKoek: (koek: string) => void;
  koek?: KoekAggregate;
}

export default function Step2({ stepNr = 2, handleNext, handleBack, selectKoek, koek }: Step2Props) {

  const [koekUrl, setKoekUrl] = useState(koek ? koek.id : "");

  const loadKoek = async () => {
    await selectKoek(koekUrl);
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
      <Typography variant="h1" color="text.primary" align="center">
        Ik wil een huis kopen
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Deelnemen koopovereenkomst
      </Typography>

      <TextField fullWidth value={koekUrl} onChange={(event) => setKoekUrl(event.target.value)}></TextField>

      <Events koek={koek} />
      <Stack sx={{ width: "50vw", marginBottom: '2rem' }} direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={loadKoek}>Laad Koopovereenkomst</Button>
        <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
      </Stack>
    </Box>
  );
}
