import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Step1({ handleNext }) {

  return (
    <Box>
      <Typography variant="h1" color="text.primary" align="center">
        Ik wil een huis kopen
      </Typography>
      <Typography variant="body1" color="text.primary" align="center">
        De verkoper heeft jouw WebID ingevuld bij het aanmaken van de koopovereenkomst. Door in te loggen kan je straks jouw gegevens toevoegen.
      </Typography>
      <Typography variant="body1" color="text.primary" align="center">
        1. Log in met je WebID of mailadres
      </Typography>
      <Button variant="contained" onClick={handleNext}>Doorgaan</Button>
    </Box>
  );
}
