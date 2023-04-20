import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import Image from "../../src/Image";
import VC, { SolidVC, VCType } from '../../src/VC';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Link from "../../src/Link";
import KoekAggregate from "../../src/koek/KoekAggregate";

function createData(
  name: string,
  value: string,
) {
  return { name, value };
}

export default function Step3({
  stepNr = 3,
  handleNext,
  handleBack = () => { },
  koek }:
  {
    stepNr: number;
    handleNext: () => void;
    handleBack: () => void;
    koek: KoekAggregate;
  }) {
  const [loadedBRPVC, setLoadedBRPVC] = useState({} as any);

  const [rows, setRows] = useState([] as Array<any>);

  const [vcValid, setVcValid] = useState(false);
  const [vcUrl, setVcUrl] = useState<string>();

  const updateVCs = useCallback(async (vcs: SolidVC[]) => {
    // useCallback is important here. With each update from vcs
    // <VC> will be re-rendered, and this will cause a new updateVCs
    // resulting in an infinite loop.

    if (vcs.length === 0) {
      setLoadedBRPVC({});
      return;
    }

    const vc = vcs[0];
    setLoadedBRPVC(vc);
    console.log('received vc', vc);

    let certificateValidity;
    // if type is string, it's a stringified JSON object
    if (typeof vc.status === "string") {
      certificateValidity = vc.status;
    } else if (vc.status.verified) {
      certificateValidity = "✅";
      setVcValid(true);
      console.log('setting vc url state', vc.url);
      setVcUrl(vc.url);
    } else {
      certificateValidity = "❌";
      setVcValid(false);
    }

    setRows([
      createData('Naam', vc.vc.credentialSubject.naam),
      createData('Geboortedatum', vc.vc.credentialSubject.geboorte.geboortedatum),
      createData('Geboorteplaats', vc.vc.credentialSubject.geboorte.geboorteplaats),
      createData('Geboorteland', vc.vc.credentialSubject.geboorte.geboorteland),
      createData('Certificaat geldig?', certificateValidity),
    ]);
  }, []);

  const handleAkkoord = useCallback(async () => {
    console.log('using this vc as persoonVCref', vcUrl);
    let success = await koek.cmdHdlr.toevoegenPersoonsgegevensRef(vcUrl);
    if (success == true) {
      handleNext();
    }
    else {
      throw new Error(`Toevoegen persoonsgegevens VC is niet gelukt! (check console voor errors)`);
    }
  }, [updateVCs, vcUrl]);

  useEffect(() => {

  }, [updateVCs]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Koppel je persoonsgegevens aan deze koopovereenkomst
      </Typography>

      <VC type={VCType.BRP} onChange={updateVCs} />

      <hr />
      {Object.keys(loadedBRPVC).length === 0 ?
        <Box>
          <Link href="/brpersonen" target="_blank">
            <Image
              src="/solid-quest/images/mijnoverheid.png"
              alt="Mijn Overheid Logo"
              width={400}
              height={180}
              style={{ display: "block", margin: "25px auto" }}
            />
          </Link>
        </Box>
        :
        <Box>
          <Typography variant="body1" color="text.primary" align="center">
            Je hebt je persoonsgegevens opgeslagen in je datakluis. Kloppen de gegevens?
          </Typography>
          {/* https://mui.com/material-ui/react-table/ */}
          <TableContainer sx={{ marginY: '3rem' }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      '&:last-child td, &:last-child th': {
                        border: 0,
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        height: '4rem',
                      }
                    }}
                  >
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      }

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        {Object.keys(loadedBRPVC).length !== 0 && <Button variant="contained" onClick={handleAkkoord} disabled={!vcValid}>Akkoord</Button>}
      </Stack>
    </Box>
  );
}
