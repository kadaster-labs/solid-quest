import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import VC, { VCType } from '../../src/VC';
import { useState } from "react";

import Image from "../../src/Image";
import KadasterKnowledgeGraph from "../../src/KadasterKnowledgeGraph";

export default function Step3({ step = 3, handleNext, handleBack = () => { } }) {
  const [loadedBRKVC, setLoadedBRKVC] = useState({} as any);

  const handleVC = (vc) => {
    // get a trigger from <VC> to enable the "Doorgaan" button
    setLoadedBRKVC(vc);
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

      <hr />

      <VC type={VCType.BRK} handleVC={handleVC} />

      <hr />
      {Object.keys(loadedBRKVC).length !== 0 ?
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <KadasterKnowledgeGraph objectId={(loadedBRKVC.credentialSubject.eigendom.perceel.identificatie as number)}/>
          <Typography variant="body1" color="text.primary" align="center">
            Het volgende object ID van het perceel is gevonden in de verifiable credential van het Kadaster.
            Maak gebruik van de Kadaster Knowledge Graph om informatie op te halen over je perceel.
          </Typography>
        </Box>
      :
        <KadasterKnowledgeGraph objectId={0}/>
      }

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {loadedBRKVC && <Button variant="contained" onClick={handleNext}>Doorgaan</Button>}
      </Stack>
    </Box>
  );
}
