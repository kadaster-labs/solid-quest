import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useCallback, useState, useContext } from "react";
import { getAllFileUrls, getRootContainerURL, saveTurtle } from "../../src/Solid";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";

const VerkoopLogboekContainer = `${getRootContainerURL()}/koopovereenkomst/id`;

export function Step1b({ handleNext, handleBack }) {
  // Loading koopovereenkomsten
  const [tableRows, setTableRows] = useState([] as Array<any>);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Creating a new koopovereenkomst
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const loadKoeks = useCallback(async (id = undefined) => {
    const files = await getAllFileUrls(VerkoopLogboekContainer);
    const ids = files.map((file) => file.split('/').pop());

    const rows = ids.map((id) => ({
      id,
      koper: 'Koos Kadastersen', // TODO: get from turtle
      koopdatum: new Date().toLocaleDateString(), // TODO: get from turtle
      koopprijs: `€ ${Math.floor(Math.random() * 5) + 1 }.${Math.floor(Math.random() * 10)}00.000`, // TODO: get from turtle
      url: `${VerkoopLogboekContainer}/${id}`,
    }));

    setTableRows(rows);

    const selected = rows.findIndex((row) => row.id == id);
    if (selected > -1) {
      setSelectedRowId(rows[selected].id);
    }
  }, []);

  useEffect(() => {
    // This function will run when the component mounts
    loadKoeks();
  }, [loadKoeks]);

  const handleConfirm = async () => {
    setIsLoading(true);
    const randomId = Math.floor(Math.random() * 100000) + 1000;
    const filepath = `${VerkoopLogboekContainer}/${randomId}`;
    await saveTurtle(filepath, `
      @prefix koopovereenkomst: <> .
      @prefix zvg: <http://taxonomie.zorgeloosvastgoed.nl/def/zvg#> .

      koopovereenkomst:
        a zvg:Koop .
    `);

    loadKoeks(randomId);
    setIsLoading(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleRowSelect = (event, row) => {
    setSelectedRowId(row.id);
  };

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
        { selectedRowId && <Button variant="contained" onClick={handleNext}>Doorgaan</Button> }
      </Stack>
    </Box>
  );
}

