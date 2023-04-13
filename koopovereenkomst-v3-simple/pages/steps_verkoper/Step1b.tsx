import { useCallback, useEffect, useState } from "react";

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

import { default as data } from "@solid/query-ldflex/lib/exports/rdflib";
import Link from "../../src/Link";
import PodIcon from "../../src/PodIcon";
import { getRootContainerURL } from "../../src/Solid";
import { SOLID_ZVG_CONTEXT } from "../../src/koek/Context";
import KoekAggregate from "../../src/koek/KoekAggregate";
import KoekRepository from "../../src/koek/KoekRepository";

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
 * - Verkoper kan een bestaande koopovereenkomst openen ✅
 * - Verkoper kan een bestaande koopovereenkomst opslaan ✅
 * - Verkoper kan events toevoegen aan een bestaande koopovereenkomst ✅
 *  - Simpelweg tellen van events, nieuwe krijgt lengte van array + 1 ✅
 */

const VerkoopLogboekContainer = function () {
  return `${getRootContainerURL()}/koopovereenkomst/id`;
}

interface Step1bProps {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  selectKoek: (koek: string) => void;
  koek: KoekAggregate;
  repo: KoekRepository;
}

export function Step1b({ stepNr = 0, handleNext, handleBack, selectKoek, koek, repo }: Step1bProps) {

  // Loading koopovereenkomsten
  const [tableRows, setTableRows] = useState([] as Array<any>);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Creating a new koopovereenkomst
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const loadKoeks = useCallback(async (selectedKoekId: string = undefined) => {
    let koekIds = await repo.list();

    // Create aggregates
    const koeks: KoekAggregate[] = [];
    for (let i = 0; i < koekIds.length; i++) {
      let aggregate = await repo.load(koekIds[i]);
      koeks.push(aggregate);
    }

    // Create table rows
    const rows = koeks.map((koek) => ({
      id: koek.id,
      object: Object.hasOwnProperty.call(koek.getData(), 'kadastraalObject') ? koek.getData().kadastraalObject.perceelNummer : "...",
      koopdatum: koek.getData().datumVanLevering || "...",
      koopprijs: koek.getData().koopprijs || "...",
      url: koek.getData().iri,
    }));

    setTableRows(rows);

    // Select the row if one was selected
    const selected = rows.findIndex((row) => row.id === selectedKoekId);
    if (selected > -1) {
      setSelectedRowId(rows[selected].id);
    }
  }, []);

  useEffect(() => {
    data.context.extend(SOLID_ZVG_CONTEXT);

    // This function will run when the component mounts
    if (koek) {
      loadKoeks(koek.id);
    } else {
      loadKoeks();
    }
  }, [loadKoeks, koek]);

  const handleConfirm = async () => {
    setIsLoading(true);
    let randomId = await repo.create()
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
    await koek.cmdHdlr.populateWithMockEvents()

    loadKoeks(koek.id);
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Aanmaken koopovereenkomst
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography variant="body1" color="text.primary" align="center" sx={{
          margin: "25px auto 0px auto",
          maxWidth: "600px",
        }}>
          Voor het aanmaken van de koopovereenkomst, kun je kiezen uit <Link href="" color="text.secondary">verschillende standaard koopovereenkomsten</Link>. Kies hieronder welke voor jou van toepassing is.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <Box sx={{ minWidth: 120, my: '2rem' }}>
            <Select value={selectedOption} onChange={handleOptionChange}>
              <MenuItem value={1}>Standaard koopovereenkomst</MenuItem>
              <MenuItem value={2}>Default koopovereenkomst</MenuItem>
              <MenuItem value={3}>Die ene koopovereenkomst</MenuItem>
            </Select>
          </Box>
          {isLoading ? <CircularProgress /> : <Button variant="contained" onClick={handleConfirm}>Create</Button>}
        </Box>
        {/* Onderste helft */}
        {tableRows.length > 0 && (
          <Box>
            <Typography variant="body1" color="text.primary" align="center" sx={{
              marginX: "auto",
              maxWidth: "600px",
            }}>
              Kies hieronder de koopovereenkomst om (verder) op te stellen.
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, '& .MuiRadio-root.Mui-checked': { color: 'rgba(255, 255, 255, 0.9)' } }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Id</TableCell>
                    <TableCell>Object</TableCell>
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
                      <TableCell>{row.object}</TableCell>
                      <TableCell>{row.koopdatum}</TableCell>
                      <TableCell>{row.koopprijs}</TableCell>
                      <TableCell>
                        <PodIcon href={row.url} target="_blank" />
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
        {selectedRowId && <Button variant="contained" onClick={createEvents}>Create events (debug)</Button>}
        {selectedRowId && <Button variant="contained" onClick={handleNext}>Doorgaan</Button>}
      </Stack>
    </Box>
  );
}

