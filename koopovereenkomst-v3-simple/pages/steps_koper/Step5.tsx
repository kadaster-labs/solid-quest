import { Modal } from "@mui/material";
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
  koek: KoekAggregate;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Step5({ stepNr = 5, finished = false, handleNext, handleBack = () => { }, navigateToMyKoeks, koek }: StepProps) {

  const [open, setOpen] = useState(false);
  const handleInschrijvenOpenbaarRegister = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAkkoord = useCallback(async () => {
    let success = await koek.cmdHdlr.tekenen(getWebId());
    if (success == true) {
      handleNext();
    }
    else {
      throw new Error(`Toevoegen persoonsgegevens VC is niet gelukt! (check console voor errors)`);
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
        Ik wil een huis kopen
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Tekenen koopovereenkomst <Typography variant="body1">#{koek?.id}</Typography>
      </Typography>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Inschrijving Openbaar Register
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Deze optionele stap is niet geïmplementeerd
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Kopers kunnen optioneel de koopovereenkomst inschrijven in het Openbaar Register bij het Kadaster.
            Daarmee verzekeren zij zich tegen faillissement van de verkoper en aanspraak op vergoeding bij de curator.
          </Typography>
        </Box>
      </Modal>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {finished && <Button variant="contained" onClick={handleInschrijvenOpenbaarRegister}>Inschrijven Openbaar Register</Button>}
        <Button variant="contained" onClick={navigateToMyKoeks}>Deelnemen Koopovereenkomst</Button>
        {!finished && <Button variant="contained" onClick={handleAkkoord}>Akkoord</Button>}
      </Stack>
    </Box>
  );
}
