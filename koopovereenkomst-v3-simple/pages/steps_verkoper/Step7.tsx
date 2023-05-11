import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ConfettiGenerator from "confetti-js";
import { Box } from "@mui/system";
import { useCallback, useEffect } from "react";
import { getWebId } from "../../src/Solid";
import KoekAggregate from "../../src/koek/KoekAggregate";
import Events from "../../src/ui-components/Events";

interface StepProps {
  stepNr: number;
  finished?: boolean;
  handleNext: () => void;
  handleBack: () => void;
  navigateToMyKoeks: () => void;
  koek: KoekAggregate;
}

export default function Step7({ stepNr = 7, finished = false, handleNext, handleBack, navigateToMyKoeks, koek }: StepProps) {

  const handleAkkoord = useCallback(async () => {
    let success = await koek.cmdHdlr.tekenen(getWebId());
    if (success) {
      handleNext()
    } else {
      throw new Error(`Tekenen niet gelukt! (check console voor errors)`);
    }
  }, [koek, handleNext]);

  useEffect(() => {
    if (finished) {
      const confettiSettings = {
        target: 'confetti-canvas',
        rotate: true,
        max: 2000,
        start_from_edge: true,
      };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();

      return () => confetti.clear();
    }
  }, [finished]) // add the var dependencies or not

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Tekenen koopovereenkomst <Typography variant="body1">#{koek?.id}</Typography>
      </Typography>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={navigateToMyKoeks}>Mijn Koopovereenkomsten</Button>
        {!finished && <Button variant="contained" onClick={handleAkkoord}>Akkoord</Button>}
      </Stack>
    </Box>
  );
}
