import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import VC, { VCType } from '../../src/VC';
import { useState } from "react";

import Image from "../../src/Image";

export default function Step3({ step = 3, handleNext, handleBack = () => { } }) {
  const [vcLoaded, setvcLoaded] = useState(false);

  const handleVCLoaded = () => {
    // get a trigger from <VC> to enable the "Doorgaan" button
    setvcLoaded(true);
  };

  return (
    <Box sx={{flex: 1}}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {step}. Koppel de woning die je wilt verkopen
      </Typography>

      <Typography variant="body1" color="text.primary" align="center">
        Bij het Kadaster kan je jouw eigendomsbewijzen ophalen, zodat je vervolgens de woning kunt selecteren die je wilt verkopen.
      </Typography>

      <Image
        src="/solid-quest/images/mijnkadaster.png"
        alt="Mijn Overheid Logo"
        width={400}
        height={180}
        style={{ display: "block", margin: "25px auto" }}
      />

      <hr/>

      <VC type={VCType.BRK} handleVCLoaded={handleVCLoaded} />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {vcLoaded && <Button variant="contained" onClick={handleNext}>Doorgaan</Button>}
      </Stack>
    </Box>
  );
}
