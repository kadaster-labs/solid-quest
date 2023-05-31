import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import VC, { SolidVC, VCType } from "../../src/verifiable/VC";

import Image from "../../src/Image";
import KadasterKnowledgeGraph from "../../src/KadasterKnowledgeGraph";
import Link from "../../src/Link";
import Events from "../../src/ui-components/Events";

export default function Step4({ stepNr = 4, handleNext, handleBack = () => { }, koek }) {
  const [loadedBRKVCs, setLoadedBRKVCs] = useState([] as SolidVC[]);
  const [vcValid, setVcValid] = useState(false);

  const updateVCs = useCallback(async (vcs: SolidVC[]) => {
    setLoadedBRKVCs(vcs);

    let vc = vcs[0];
    if (typeof vc.status !== "string" && vc.status.verified) {
      setVcValid(true);
    } else {
      setVcValid(false);
    }

  }, []);

  const handleAkkoord = useCallback(async () => {
    let vc = loadedBRKVCs[0];
    let success = await koek.cmdHdlr.toevoegenEigendomRef(vc);
    if (success == true) {
      handleNext();
    }
    else {
      throw new Error(`Toevoegen eigendom VC is niet gelukt! (check console voor errors)`);
    }
  }, [loadedBRKVCs, handleNext, koek]);

  useEffect(() => {

  }, [updateVCs]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koppel de woning die je wilt verkopen
      </Typography>

      <Typography variant="body1" color="text.primary" align="center">
        Bij het Kadaster kan je jouw eigendomsbewijzen ophalen, zodat je vervolgens de woning kunt selecteren die je wilt verkopen.
      </Typography>

      <VC type={VCType.BRK} onChange={updateVCs} />

      <hr />
      {loadedBRKVCs.length !== 0 ?
        <Box>
          <Typography variant="body1" color="text.primary" align="center">
            Je hebt je eigendomsgegevens opgeslagen in je datakluis. Kloppen de gegevens?
          </Typography>
          <Typography variant="body1" color="text.primary" align="center" fontWeight="bold" fontStyle="italic">
            Certificaat geldig? {loadedBRKVCs[0].status.verified ? "✅" : "❌"}
          </Typography>
          <Typography variant="body1" color="text.primary" align="center" sx={{
            margin: "25px auto",
            maxWidth: "600px",
          }}>
            Het volgende object ID van het perceel is gevonden in de verifiable credential van het Kadaster.
            Maak gebruik van de Kadaster Knowledge Graph om informatie op te halen over je perceel.
          </Typography>
          <KadasterKnowledgeGraph objectId={(loadedBRKVCs[0].vc.credentialSubject.eigendom.perceel.identificatie as string)} />
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

      <Events koek={koek} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {loadedBRKVCs.length !== 0 && <Button variant="contained" onClick={handleAkkoord} disabled={!vcValid}>Akkoord</Button>}
      </Stack>
    </Box>
  );
}