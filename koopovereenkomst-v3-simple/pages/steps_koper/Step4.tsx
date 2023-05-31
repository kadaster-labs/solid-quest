import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";


import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import KoekAggregate from '../../src/koek/KoekAggregate';
import { koopprijsFormatter } from "../../src/koek/KoekState";
import Events from "../../src/ui-components/Events";

interface Step4Props {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  reloadKoek: () => void;
  koek: KoekAggregate;
}

export default function Step4({ stepNr = 4, handleNext, handleBack, reloadKoek, koek }: Step4Props) {

  const [koekComplete, setKoekComplete] = useState<boolean>(false);

  useEffect(() => {
    setKoekComplete(koek.isComplete());
  }, [koek]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Ik wil een huis kopen
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Concept koopovereenkomst
      </Typography>

      <Box>
        {koek && <Box>
          <Typography>Koopovereenkomst #{koek.id}</Typography>
          <List>
            <ListItem>Type: {koek.data.typeKoopovereenkomst}</ListItem>
            <ListItem>Perceelnr: {koek.data.kadastraalObject?.perceelNummer}</ListItem>
            <ListItem>Aangeboden door: {koek.data.aangebodenDoor}</ListItem>
            <ListItem>Aan: {koek.data.aan}</ListItem>
            <ListItem>Koopprijs: {koopprijsFormatter.format(+koek.data.koopprijs)}</ListItem>
            <ListItem>Datum levering: {koek.data.datumVanLevering}</ListItem>
          </List>
        </Box>}
        <Events koek={koek} show={false} />
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={reloadKoek}>Herladen koopovereenkomst</Button>
        <Button variant="contained" onClick={handleNext} disabled={!koekComplete}>Doorgaan</Button>
      </Stack>
    </Box>
  );
}
