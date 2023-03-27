import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import VC, { VCType } from '../../src/VC';
import Image from "../../src/Image";
import { useState } from "react";

export default function Step2({ step = 2, handleNext, handleBack = () => { } }) {
  const [vcLoaded, setvcLoaded] = useState(false);

  const handleVC = (_vc) => {
    // get a trigger from <VC> to enable the "Doorgaan" button
    setvcLoaded(true);
  };

  return (
    <Box sx={{flex: 1}}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {step}. Koppel je persoonsgegevens aan deze koopovereenkomst
      </Typography>

      <Image
        src="/solid-quest/images/mijnoverheid.png"
        alt="Mijn Overheid Logo"
        width={400}
        height={180}
        style={{ display: "block", margin: "25px auto" }}
      />

      <hr/>

      <VC type={VCType.BRP} handleVC={handleVC}/>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {vcLoaded && <Button variant="contained" onClick={handleNext}>Doorgaan</Button> }
      </Stack>
    </Box>
  );
}
