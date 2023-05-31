import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import ConfettiGenerator from "confetti-js";
import { useCallback, useEffect, useState } from "react";
import { getWebId } from "../../src/Solid";
import KoekAggregate from "../../src/koek/KoekAggregate";
import Events from "../../src/ui-components/Events";

interface StepProps {
  stepNr: number;
  finished?: boolean;
  handleNext: () => void;
  handleBack: () => void;
  navigateToMyKoeks: () => void;
  reloadKoek: () => void;
  koek: KoekAggregate;
}

export default function Step7({ stepNr = 7, finished = false, handleNext, handleBack, navigateToMyKoeks, reloadKoek, koek }: StepProps) {

  const [isGetekendDoorVerkoper, setIsGetekendDoorVerkoper] = useState(finished);

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
    else if (!isGetekendDoorVerkoper) {
      setIsGetekendDoorVerkoper(koek?.getEvents().filter((e) => e.type === "conceptKoopovereenkomstGetekend" && e.actor === "verkoper-vera").length > 0);
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
        {isGetekendDoorVerkoper && <Button variant="contained" onClick={reloadKoek}>Herladen koopovereenkomst</Button>}
        <Button variant="contained" onClick={navigateToMyKoeks}>Mijn Koopovereenkomsten</Button>
        {!isGetekendDoorVerkoper && <Button variant="contained" onClick={handleAkkoord}>Ondertekenen</Button>}
      </Stack>
    </Box>
  );
}
