import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

import { getInteger, getSolidDataset, getThingAll } from '@inrupt/solid-client';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { useSession } from "@inrupt/solid-ui-react";
import { useCallback, useEffect, useState } from "react";
import { SOLID_ZVG_CONTEXT } from '../../src/koek/Context';

import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { default as data } from "@solid/query-ldflex/lib/exports/rdflib";
import Link from "../../src/Link";
import KoekAggregate from '../../src/koek/KoekAggregate';

const zvg_base = 'http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'
const zvg = {
  koopsom: zvg_base + 'koopsom',
}

interface Case {
  caseId?: string;
  koopsom?: number;
}

interface Step5Props {
  stepNr: number;
  handleNext: () => void;
  handleBack: () => void;
  koek: KoekAggregate;
}

export function Step5({ stepNr = 5, handleNext, handleBack, koek }: Step5Props) {
  const title = "Verkoper Homepage";

  const { session } = useSession();
  const webId = session.info.webId;

  const [podUrl, setPodUrl] = useState("");
  const [caseId, setCaseId] = useState("");
  const [curCase, setCase] = useState<Case>({} as Case);
  const [errors, setErrors] = useState("");
  const [eventLabels, setEventLabels] = useState([]);

  useEffect(() => {
    if (koek) {
      setCaseId(koek.id);
    }
  }, [koek]);

  const koopovereenkomstFile = () => {
    return `${podUrl}koopovereenkomst-${caseId}.ttl`;
  };

  const openenKoopovereenkomstWithInruptSolidClient = async function () {
    try {
      console.log(`Openen van Koopovereenkomst [caseId: ${caseId}]`);

      const theKO = await getSolidDataset(koopovereenkomstFile(), {
        fetch: fetch,
      });

      for (const thing of getThingAll(theKO)) {
        // De koper vraagt specifiek de koopsom op.
        const koopsom = getInteger(thing, zvg.koopsom);
        if (koopsom) {
          console.log(`Koopsom: ${koopsom}`);
          // alert(`Koopsom: ${koopsom}`);
          setCase((prevState) => ({
            ...prevState,
            koopsom: koopsom,
          }));
        }
      }
    } catch (error) {
      setErrors("Error opening koopovereenkomst! " + error);
      throw error;
    }
  };

  const openenKoopovereenkomstWithLDflex = useCallback(async function () {
    try {
      console.log(`Openen van Koopovereenkomst [caseId: ${caseId}]`);

      const aggregate = koek;

      try {
        setEventLabels(aggregate.getEvents());
      } catch (error) {
        setErrors("Error handling events of koopovereenkomst! " + error);
        console.error("Error handling events of koopovereenkomst!", error);
      }

      console.log(
        `\nAANGEBODEN DOOR: ${await aggregate.getData().aangebodenDoor}`
      );
      console.log(`\nAAN: ${await aggregate.getData().aan}`);
      console.log(`\nKOOPPRIJS: ${await aggregate.getData().koopprijs}`);

      console.log("dump JSON+LD", await aggregate.dumpJsonLD());
      console.log("dump NQuads", await aggregate.dumpNQuads());
    } catch (error) {
      setErrors("Error opening koopovereenkomst! " + error);
      throw error;
    }
  }, [caseId, webId]);

  useEffect(() => {
    if (webId !== "") {
      try {
        const url = new URL(webId);
        const thePodUrl = webId.split(url.pathname)[0] + "/";
        console.debug("The POD url is: ", thePodUrl);
        setPodUrl(thePodUrl);
      } catch (error) { }

      // https://github.com/LDflex/Query-Solid#adding-a-custom-json-ld-context
      data.context.extend(SOLID_ZVG_CONTEXT);
    }

    if (caseId) {
      openenKoopovereenkomstWithLDflex();
    }
  }, [podUrl, webId, openenKoopovereenkomstWithLDflex, caseId]);

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="h2" color="text.primary" align="center">
        {stepNr}. Aanmaken koopovereenkomst
      </Typography>

      <Box>
        <Box>
          <p>logged in: {webId}</p>
          <p>POD url: {podUrl}</p>
          <TextField
            id="caseId"
            label="Koopovereenkomst nummer"
            variant="outlined"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            sx={{ width: "50ch" }}
          />
        </Box>
        <Box sx={{ p: "2rem 0" }}>

          <Button variant="contained" onClick={openenKoopovereenkomstWithLDflex}>
            Openen met LDflex (with console logging)
          </Button>
        </Box>
        <Box sx={{ p: "2rem 0" }}>
          {false &&
            <Button disabled onClick={openenKoopovereenkomstWithInruptSolidClient}>
              Openen met Inrupt Solid Client
            </Button>
          }
          <Box>
            <List>
              {eventLabels.map((e, i) => (
                <ListItem key={i} sx={{
                  ...(e.actor === "verkoper-vera" && {
                    textAlign: "right",
                  })
                }}>
                  <Link href={e.id} target="_blank" rel="noreferrer" style={{
                    padding: "0 2rem",
                    borderRadius: "0.5rem",
                    color: "white",
                    textDecoration: "none",
                    width: "80%",
                    ...(e.actor === "verkoper-vera" && {
                      marginLeft: "auto",
                    }),
                    ...(e.actor === "verkoper-vera" && {
                      backgroundColor: "rgb(106, 136, 165, 0.8)",
                    }),
                    ...(e.actor === "koper-koos" && {
                      backgroundColor: "rgb(125, 122, 95, 0.8)",
                    })
                  }}>
                    <ListItemText sx={{
                    }}
                      primary={e.newLabel}
                      secondary={e.actor}
                    />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
          {errors !== "" && (
            <Box sx={{
              color: "black",
              backgroundColor: "rgb(255, 223, 223)",
              border: "1px solid rgb(114, 0, 0)",
              m: "1rem",
              p: "0.5rem",
            }}>
              <Typography>{errors}</Typography>
              <Button onClick={() => setErrors("")}>clear</Button>
            </Box>
          )}
          {curCase.caseId && (
            <Box>
              <Typography>Koopovereenkomst info (from {koopovereenkomstFile()}):</Typography>
              <List>
                <ListItem>Koopsom: {curCase.koopsom}</ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
      </Stack>
    </Box>
  );
}
