import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from "react";
import Events from "../../src/ui-components/Events";

export default function Step5({ stepNr = 5, handleNext, handleBack = () => { }, koek }) {

  const [datum, setDatum] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    console.log('datum set to', datum);
  }, [setDatum]);

  const handleAkkoord = useCallback(async () => {
    let success = await koek.cmdHdlr.datumVanLeveringVastgesteld(datum);
    if (success == true) {
      handleNext();
    }
    else {
      throw new Error(`Vaststellen van de datum van levering is mislukt! (check console voor errors)`);
    }
  }, [setDatum]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koopdetails
      </Typography>

      <Box sx={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.1)", m: "1rem 0" }}>
        <Typography variant="body1">Leveringsdatum ({datum.format('DD-MM-YYYY')})</Typography>
        <DateCalendar value={datum} onChange={(newDate) => setDatum(newDate)} />
      </Box>

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>
          Terug
        </Button>
        <Button variant="contained" onClick={handleAkkoord}>
          Akkoord
        </Button>
      </Stack>
    </Box>
  );
}