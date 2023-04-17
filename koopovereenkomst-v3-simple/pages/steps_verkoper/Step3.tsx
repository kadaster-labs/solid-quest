import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import VC, { SolidVC, VCType } from '../../src/VC';
import { useCallback, useState } from "react";

import Image from "../../src/Image";
import KadasterKnowledgeGraph from "../../src/KadasterKnowledgeGraph";
import Link from "../../src/Link";

export default function Step3({ stepNr = 3, handleNext, handleBack = () => { } }) {
  const [loadedBRKVC, setLoadedBRKVC] = useState([] as any);

  const updateVCs = useCallback(async (vcs: SolidVC[]) => {
    setLoadedBRKVC(vcs);
  }, []);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koppel de woning die je wilt verkopen
      </Typography>

      <Typography variant="body1" color="text.primary" align="center">
        Bij het Kadaster kan je jouw eigendomsbewijzen ophalen, zodat je vervolgens de woning kunt selecteren die je wilt verkopen.
      </Typography>

      <VC type={VCType.BRK} onChange={updateVCs} />

      <hr />
      {loadedBRKVC.length !== 0 ?
        <Box>
          <Typography variant="body1" color="text.primary" align="center">
            Je hebt je eigendomsgegevens opgeslagen in je datakluis. Kloppen de gegevens?
          </Typography>
          <Typography variant="body1" color="text.primary" align="center" fontWeight="bold" fontStyle="italic">
            Certificaat geldig? {loadedBRKVC[0].status.verified ? "✅" : "❌"}
          </Typography>
          <Typography variant="body1" color="text.primary" align="center" sx={{
            margin: "25px auto",
            maxWidth: "600px",
          }}>
            Het volgende object ID van het perceel is gevonden in de verifiable credential van het Kadaster.
            Maak gebruik van de Kadaster Knowledge Graph om informatie op te halen over je perceel.
          </Typography>
          <KadasterKnowledgeGraph objectId={(loadedBRKVC[0].vc.credentialSubject.eigendom.perceel.identificatie as number)} />
        </Box>
        :
        <Box>
          <Link href="/brkadaster" target="_blank">
            <Image
              src="/solid-quest/images/mijnkadaster.png"
              alt="Mijn Overheid Logo"
              width={400}
              height={180}
              style={{ display: "block", margin: "25px auto" }}
            />
          </Link>
        </Box>
      }

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {loadedBRKVC.length !== 0 && <Button variant="contained" onClick={handleNext}>Akkoord</Button>}
      </Stack>
    </Box>
  );
}
