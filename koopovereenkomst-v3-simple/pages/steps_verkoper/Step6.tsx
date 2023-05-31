import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";


import { List, ListItem } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "../../src/Link";
import KoekAggregate from '../../src/koek/KoekAggregate';
import { koopprijsFormatter } from "../../src/koek/KoekState";
import Events from "../../src/ui-components/Events";

interface Step6Props {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  reloadKoek: () => void;
  koek: KoekAggregate;
}

export default function Step6({ stepNr = 6, handleNext, handleBack, reloadKoek, koek }: Step6Props) {

  const [koekComplete, setKoekComplete] = useState<boolean>(false);

  useEffect(() => {
    setKoekComplete(koek.isComplete());
  }, [koek, reloadKoek]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Concept koopovereenkomst
      </Typography>

      <Box>
        {koek && <Box>
          <Typography>Koopovereenkomst <Link href={koek?.data.iri} color="text.primary" target="_blank">#{koek?.id}</Link></Typography>
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
