import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import VC, { VCType } from '../../src/VC';
import Image from "../../src/Image";
import { useState } from "react";
import { verifyVC } from "../../src/verify";
import PodIcon from "../../src/PodIcon";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  name: string,
  value: string,
) {
  return { name, value };
}

export default function Step2({ step = 2, handleNext, handleBack = () => { } }) {
  const [loadedBRPVC, setLoadedBRPVC] = useState({} as object);
  const [loadedBRPVCUrl, setLoadedBRPVCUrl] = useState("" as string);
  const [loadedBRPVCVerification, setLoadedBRPVCVerification] = useState({} as object);

  const [rows, setRows] = useState([] as Array<any>);

  const handleVC = async (vc: any, url: string) => {
    // get a trigger from <VC> to enable the "Doorgaan" button
    const verificationResult = await verifyVC(vc);

    setLoadedBRPVC(vc);
    setLoadedBRPVCUrl(url);
    setLoadedBRPVCVerification(verificationResult);

    setRows([
      createData('Naam', vc.credentialSubject.naam),
      createData('Geboortedatum', vc.credentialSubject.geboorte.geboortedatum),
      createData('Geboorteplaats', vc.credentialSubject.geboorte.geboorteplaats),
      createData('Geboorteland', vc.credentialSubject.geboorte.geboorteland),
      createData('Certificaat geldig?', verificationResult.verified ? '✅' : '❌'),
    ]);
  };

  return (
    <Box sx={{flex: 1}}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {step}. Koppel je persoonsgegevens aan deze koopovereenkomst
      </Typography>

      {Object.keys(loadedBRPVC).length === 0 ?
      <Box>
        <Image
          src="/solid-quest/images/mijnoverheid.png"
          alt="Mijn Overheid Logo"
          width={400}
          height={180}
          style={{ display: "block", margin: "25px auto" }}
        />

        <hr/>
        <VC type={VCType.BRP} handleVC={handleVC}/>
      </Box>
      :
      <Box>
        <Typography variant="body1" color="text.primary" align="center">
          Je hebt je persoonsgegevens opgeslagen in je datakluis. <PodIcon sx={{ mx: "1rem", verticalAlign: "middle" }} href={loadedBRPVCUrl} />
          <br/>Kloppen de gegevens?
        </Typography>
        {/* https://mui.com/material-ui/react-table/ */}
        <TableContainer sx={{ marginY: '4rem' }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': {
                    border: 0,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    height: '4rem',
                  } }}
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
        {Object.keys(loadedBRPVC).length !== 0 && <Button variant="contained" onClick={handleNext}>Doorgaan</Button> }
      </Stack>
    </Box>
  );
}
