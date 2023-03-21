import { useSession } from "@inrupt/solid-ui-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import ConnectSolid from "../../src/ConnectSolid";

export default function Step1({ handleNext, handleBack = () => { } }) {

  const { session } = useSession();
  // const webId = session.info.webId;

  let isLoggedIn = session.info.isLoggedIn;

  useEffect(() => {
    isLoggedIn = session.info.isLoggedIn
  })


  return (
    <Box sx={{flex: 1}}>
      <Typography variant="h1" color="text.primary" align="center">
        Start een nieuwe koopovereenkomst
      </Typography>
      <Typography variant="body1" color="text.primary" align="center">
        {
          "Om een koopovereenkomst te starten als verkoper, doorloop je verschillende stappen."
        }
      </Typography>
      <Box>
        <Typography variant="body1" color="text.primary" align="center">
          {"1. Log in met je WebID of mailadres"}
        </Typography>
        <ConnectSolid />
      </Box>

      { isLoggedIn &&
      <Stack direction="row" justifyContent="end">
        <Button disabled={!isLoggedIn} variant="contained" onClick={handleNext}>Doorgaan</Button>
      </Stack>
      }
    </Box>
  );
}
