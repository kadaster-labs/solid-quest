import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

import { useEffect, useState } from "react";

import { List, ListItem, ListItemText } from "@mui/material";
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

  const [errors, setErrors] = useState("");
  const [eventLabels, setEventLabels] = useState([]);

  useEffect(() => {
    if (koek) {

      try {
        setEventLabels(koek.getEvents());
      } catch (error) {
        setErrors("Error handling events of koopovereenkomst! " + error);
        console.error("Error handling events of koopovereenkomst!", error);
      }
    }
  }, [koek]);

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
          <Typography>Koopovereenkomst #{koek.id}</Typography>
          <List>
            <ListItem>Type: {koek.data.typeKoopovereenkomst}</ListItem>
            <ListItem>Perceelnr: {koek.data.kadastraalObject?.perceelNummer}</ListItem>
            <ListItem>Aangeboden door: {koek.data.aangebodenDoor}</ListItem>
            <ListItem>Aan: {koek.data.aan}</ListItem>
            <ListItem>Koopprijs: {koek.data.koopprijs}</ListItem>
            <ListItem>Datum levering: {koek.data.datumVanLevering}</ListItem>
          </List>
        </Box>
        <Box sx={{ p: "2rem 0" }}>
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
        </Box>
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={handleBack}>Terug</Button>
        <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
      </Stack>
    </Box>
  );
}
