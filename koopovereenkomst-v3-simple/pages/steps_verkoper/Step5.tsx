import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { DateCalendar } from "@mui/x-date-pickers";
import { Dayjs } from 'dayjs';
import React, { useCallback, useState } from "react";
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import KoekAggregate from "../../src/koek/KoekAggregate";
import Events from "../../src/ui-components/Events";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        valueIsNumericString
        decimalScale={0}
        prefix="€ "
      />
    );
  },
);

export default function Step5(
  {
    stepNr = 5,
    handleNext,
    handleBack = () => { },
    koek
  }: {
    stepNr: number;
    handleNext: () => void;
    handleBack: () => void;
    koek: KoekAggregate;
  }) {

  const [datum, setDatum] = useState<Dayjs | null>(koek.getDatumVanLevering());
  const [koopprijs, setKoopprijs] = useState(String(koek.data.koopprijs));

  const handleAkkoord = useCallback(async () => {
    let success = await koek.cmdHdlr.datumVanLeveringVastgesteld(datum);
    success = success && await koek.cmdHdlr.koopprijsVastgesteld(+koopprijs);
    if (success) {
      handleNext();
    }
    else {
      throw new Error(`Vaststellen van de datum van levering is mislukt! (check console voor errors)`);
    }
  }, [datum, koopprijs]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koopdetails
      </Typography>

      <Box sx={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.1)", m: "1rem 0" }}>
        <Typography variant="body1">Leveringsdatum ({datum ? datum.format('DD-MM-YYYY') : ""})</Typography>
        <DateCalendar value={datum} onChange={(newDate) => setDatum(newDate)} />
      </Box>

      <Box sx={{ textAlign: "center", backgroundColor: "rgba(255,255,255,0.1)", m: "1rem 0" }}>
        <TextField
          label="Koopprijs"
          value={koopprijs}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setKoopprijs(event.target.value);
          }}
          name="numberformat"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumericFormatCustom as any
          }}
          variant="standard"
        />
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