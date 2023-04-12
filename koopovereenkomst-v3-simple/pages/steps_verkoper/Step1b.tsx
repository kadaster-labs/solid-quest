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

import { default as data } from "@solid/query-ldflex/lib/exports/rdflib";
import Link from "../../src/Link";
import PodIcon from "../../src/PodIcon";
import { getAllFileUrls, getRootContainerURL, saveTurtle } from "../../src/Solid";
import { SOLID_ZVG_CONTEXT } from "../../src/aggregate/context";
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
 * - Verkoper kan een bestaande koopovereenkomst openen ✅
 * - Verkoper kan een bestaande koopovereenkomst opslaan ✅
 * - Verkoper kan events toevoegen aan een bestaande koopovereenkomst ✅
 *  - Simpelweg tellen van events, nieuwe krijgt lengte van array + 1 ✅
 */

// @ts-ignore
import { PathFactory } from 'ldflex';
// @ts-ignore
import ComunicaEngine from '@ldflex/comunica'
import { namedNode } from '@rdfjs/data-model'

export function pathFactory(sources: any, options?: any) {
  console.log('pathFactory', sources, options)
  const queryEngine = options?.queryEngine ?? new ComunicaEngine(sources, options);
  const context = options?.context ?? {};
  return new PathFactory({ queryEngine, context });
}

const NAMESPACE = /^[^]*[#/]/;

export function createPathUsingFactory(factory: any) {
  return function createPath(node: any, sources?: any, options?: any) {
    const _options = options ?? {}
    const subject = typeof node === 'string' ? namedNode(node) : node;
    
    const namespace = NAMESPACE.exec(subject.value)?.[0] ?? ''
    console.log(namespace)
    
    // Try and use the original nodes namespace for the vocab if no context is provided
    const context = _options.context ?? { "@context": {
      "@vocab": "http://xmlns.com/foaf/0.1/",
      "friends": "knows",
    } }
  
    return factory(sources ?? namespace, { ..._options, context }).create({ subject });
  }
}


// const context = {
  // "@context": {
  //   "@vocab": "http://xmlns.com/foaf/0.1/",
  //   "friends": "knows",
  // }
// };
// // The query engine and its source
// const queryEngine = new ComunicaEngine('https://ruben.verborgh.org/profile/');
// // The object that can create new paths
// const paths = new PathFactory({ context, queryEngine });

export const createPath = createPathUsingFactory(pathFactory)
const path = pathFactory('https://ruben.verborgh.org/profile/#me', { context: { "@context": {
  "@vocab": "http://xmlns.com/foaf/0.1/",
  "friends": "knows",
} } });
const ruben = path.create('https://ruben.verborgh.org/profile/#me');
// const ruben = createPath('https://ruben.verborgh.org/profile/#me');

const path2 = pathFactory('http://localhost:3001/verkoper-vera/koopovereenkomst/id/22067', { context: { "@context": {
  '@vocab': 'https://www.w3.org/TR/prov-o/#',
  'i': 'http://localhost:3001/koper-koos/koopovereenkomst/events/id/',
  'id0': 'http://localhost:3001/verkoper-vera/koopovereenkomst/events/id/',
} } });
const ruben2 = path2.create('http://localhost:3001/verkoper-vera/koopovereenkomst/id/22067');

async function showPerson(person) {
  console.log(`This person is ${await person.name}`);

  console.log(`${await person.givenName} is friends with:`);
  for await (const name of person.friends.givenName)
    console.log(`- ${name}`)
}

async function showKoek(koek) {
  console.log(`This koek is ${await koek.wasGeneratedBy.values}`);
}

// showPerson(ruben);
showKoek(ruben2);

const VerkoopLogboekContainer = function () {
  return `${getRootContainerURL()}/koopovereenkomst/id`;
}

interface Step1bProps {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  selectKoek: (koek: string) => void;
  koek: KoopovereenkomstAggregate;
}

export function Step1b({stepNr = 0, handleNext, handleBack, selectKoek, koek }: Step1bProps) {

  // Loading koopovereenkomsten
  const [tableRows, setTableRows] = useState([] as Array<any>);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Creating a new koopovereenkomst
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const loadKoeks = useCallback(async (selectedKoekId: string = undefined) => {
    const koekUrls = await getAllFileUrls(VerkoopLogboekContainer());
    console.log(koekUrls);
    const ids = koekUrls.map((file) => file.split('/').pop());

    // Create aggregates
    const koeks: KoopovereenkomstAggregate[] = [];
    for (let i = 0; i < ids.length; i++) {
      const ko = data[koekUrls[i]];
      const aggregate = new KoopovereenkomstAggregate(koekUrls[i], ids[i]);
      // console.log(aggregate)

      // try {
      //   for await (const eventUri of ko.wasGeneratedBy) {
      //     await aggregate.handleEvent(eventUri);
      //   }
      // } catch (e) {
      //   console.error(e);
      // }

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
        actor: 'verkoper',
      },
      {
        type: 'kadastraalObjectIdToegevoegd',
        data: {
          kadastraalObjectId: "10020263270000",
        },
        actor: 'verkoper',
      },
      {
        type: 'koopprijsToegevoegd',
        data: {
          // random price between 100k and 1m
          koopprijs: Math.floor(Math.random() * 900000) + 100000,
        },
        actor: 'verkoper',
      },
      {
        type: 'datumVanLeveringToegevoegd',
        data: {
          datumVanLevering: new Date().toISOString(),
        },
        actor: 'verkoper',
      },
      {
        type: 'persoonsgegevensRefToegevoegd',
        data: {},
        actor: 'verkoper',
      },
      {
        type: 'persoonsgegevensRefToegevoegd',
        data: {},
        actor: 'koper-koos',
      },
      {
        type: 'conceptKoopovereenkomstKoperOpgeslagen',
        data: {},
        actor: 'koper-koos',
      },
      {
        type: 'conceptKoopovereenkomstKoperOpgeslagen',
        data: {},
        actor: 'verkoper',
      },
      {
        type: 'conceptKoopovereenkomstGetekend',
        data: {},
        actor: 'verkoper',
      },
      {
        type: 'conceptKoopovereenkomstGetekend',
        data: {},
        actor: 'koper-koos',
      },
      {
        type: 'getekendeKoopovereenkomstVerkoperOpgeslagen',
        data: {},
        actor: 'verkoper',
      },
      {
        type: 'getekendeKoopovereenkomstVerkoperOpgeslagen',
        data: {},
        actor: 'koper-koos',
      },
      {
        type: 'getekendeKoopovereenkomstKoperTerInschrijvingAangebodenBijKadaster',
        data: {},
        actor: 'koper-koos',
      },
    ];

    for (let seq = 0; seq < events.length; seq++) {
      const id = uuidv4();

      const event: Event = {
        aggregateId: koek.id,
        id,
        type: events[seq].type,
        seq: seq,
        actor: events[seq].actor,
        label: `${seq}-${events[seq].actor}-${events[seq].type}`,
        time: new Date().toISOString(),
        ...events[seq].data
      }

      await koek.addEvent(event);
    }

    await koek.save();
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
                        <Link href={row.url} target="_blank">
                          <PodIcon />
                        </Link>
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

