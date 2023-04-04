import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from "@mui/material/Radio";
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";

import { getAllFileUrls, getRootContainerURL, saveTurtle } from "../../src/Solid";
import KoopovereenkomstAggregate, { Event } from "../../src/aggregate/koopovereenkomst-aggregate";

/**
 * Wat is het opbouwen van de koopovereenkomst precies?
 *
 * - Verkooplogboek
 *  - Bij verkoper
 *  - Verwijzingen naar events
 * - Lijst van events
 *  - Verspreid over verkoper en koper
 *
 * Functionaliteit:
 * - Verkoper kan een nieuwe koopovereenkomst aanmaken ✅
 * - Verkoper kan een bestaande koopovereenkomst openen
 * - Verkoper kan een bestaande koopovereenkomst opslaan
 * - Verkoper kan events toevoegen aan een bestaande koopovereenkomst
 *  - Simpelweg tellen van events, nieuwe krijgt lengte van array + 1
 */

const VerkoopLogboekContainer = function() {
  return `${getRootContainerURL()}/koopovereenkomst/id`;
}

interface Step1bProps {
  handleNext: () => void;
  handleBack: () => void;
  selectKoek: (koek: string) => void;
  koek: KoopovereenkomstAggregate;
}

export function Step1b({ handleNext, handleBack, selectKoek, koek }: Step1bProps) {

  // Loading koopovereenkomsten
  const [tableRows, setTableRows] = useState([] as Array<any>);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Creating a new koopovereenkomst
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const loadKoeks = useCallback(async (id: string = undefined) => {
    const files = await getAllFileUrls(VerkoopLogboekContainer());
    const ids = files.map((file) => file.split('/').pop());

    const rows = ids.map((id) => ({
      id,
      koper: 'Koos Kadastersen', // TODO: get from turtle
      koopdatum: new Date().toLocaleDateString(), // TODO: get from turtle
      koopprijs: `€ ${Math.floor(Math.random() * 5) + 1 }.${Math.floor(Math.random() * 10)}00.000`, // TODO: get from turtle
      url: `${VerkoopLogboekContainer()}/${id}`,
    }));

    setTableRows(rows);

    const selected = rows.findIndex((row) => row.id == id);
    if (selected > -1) {
      setSelectedRowId(rows[selected].id);
    }
  }, []);

  useEffect(() => {
    // This function will run when the component mounts
    if (koek) {
      loadKoeks(koek.id);
    } else {
      loadKoeks();
    }
  }, [loadKoeks, koek]);

  const handleConfirm = async () => {
    setIsLoading(true);
    const randomId = (Math.floor(Math.random() * 100000) + 1000).toString();

    const filepath = `${VerkoopLogboekContainer()}/${randomId}`;
    await saveTurtle(filepath, `
      @prefix koopovereenkomst: <> .
      @prefix zvg: <http://taxonomie.zorgeloosvastgoed.nl/def/zvg#> .

      koopovereenkomst:
        a zvg:Koop .
    `);

    selectKoek(randomId);

    loadKoeks(randomId);
    setIsLoading(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleRowSelect = (event, row) => {
    setSelectedRowId(row.id);
    selectKoek(row.id);
  };

  const createEvents = async () => {
    const events = [
      {
        type: 'koopovereenkomstGeinitieerd',
        data: {
          template: 'NVM Simple Default Koophuis',
        },
      },
      {
        type: 'kadastraalObjectIdToegevoegd',
        data: {
          kadastraalObjectId: "10020263270000",
        },
      },
      {
        type: 'koopprijsToegevoegd',
        data: {
          koopprijs: 425000,
        },
      },
      {
        type: 'persoonsgegevensRefToegevoegd',
        data: {},
      },
    ];

    for (let seq = 0; seq < events.length; seq++) {
      const id = uuidv4();

      const event: Event = {
        aggregateId: koek.id,
        id,
        type: events[seq].type,
        seq: seq,
        actor: 'Verkoper',
        label: `${seq}-Verkoper-${events[seq].type}`,
        time: new Date().toISOString(),
        ...events[seq].data
      }

      
      await koek.addEvent(event);
    }
    
    await koek.save();
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        4. Aanmaken koopovereenkomst
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography variant="body1" color="text.primary" align="center" sx={{
          margin: "25px auto 0px auto",
          maxWidth: "600px",
        }}>
          Voor het aanmaken van de koopovereenkomst, kun je kiezen uit <Link href="">verschillende standaard koopovereenkomsten</Link>. Kies hieronder welke voor jou van toepassing is.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <Box sx={{ minWidth: 120, my: '2rem' }}>
            <Select value={selectedOption} onChange={handleOptionChange}>
              <MenuItem value={1}>Standaard koopovereenkomst</MenuItem>
              <MenuItem value={2}>Default koopovereenkomst</MenuItem>
              <MenuItem value={3}>Die ene koopovereenkomst</MenuItem>
            </Select>
          </Box>
          { isLoading ? <CircularProgress/> : <Button variant="contained" onClick={handleConfirm}>Create</Button> }
        </Box>
        {/* Onderste helft */}
        { tableRows.length > 0 && (
        <Box>
          <Typography variant="body1" color="text.primary" align="center" sx={{
            marginX: "auto",
            maxWidth: "600px",
          }}>
            Kies hieronder de koopovereenkomst om (verder) op te stellen.
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, '& .MuiRadio-root.Mui-checked': {color: 'rgba(255, 255, 255, 0.9)'} }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"/>
                  <TableCell>Id</TableCell>
                  <TableCell>Koper</TableCell>
                  <TableCell>Datum</TableCell>
                  <TableCell>Prijs</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={(event) => handleRowSelect(event, row)}
                    selected={selectedRowId === row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Radio checked={selectedRowId === row.id} />
                    </TableCell>
                    <TableCell component="th" scope="row">{row.id}</TableCell>
                    <TableCell>{row.koper}</TableCell>
                    <TableCell>{row.koopdatum}</TableCell>
                    <TableCell>{row.koopprijs}</TableCell>
                    <TableCell>
                      <Link href={row.url} target="_blank">Link</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      </Box>

      <Stack sx={{ width: "50vw", marginBottom: '2rem' }} direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        { selectedRowId && <Button variant="contained" onClick={createEvents}>Create events (debug)</Button> }
        { selectedRowId && <Button variant="contained" onClick={handleNext}>Doorgaan</Button> }
      </Stack>
    </Box>
  );
}

