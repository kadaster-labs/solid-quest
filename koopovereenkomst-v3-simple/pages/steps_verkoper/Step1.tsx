import { useSession } from "@inrupt/solid-ui-react";
import {
  getDate,
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
  ThingPersisted,
} from "@inrupt/solid-client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import ConnectSolid from "../../src/ConnectSolid";
import { checkIfWebIDIsReady, registerWebID } from "../../src/mosService";

import { VCARD } from "@inrupt/vocab-common-rdf";
import { SolidPerson, SolidAddress } from "../../src/Solid";

export function Step1({ handleNext, handleBack = () => {} }) {
  const { session } = useSession();

  const [isReady, setIsReady] = useState(null as boolean);
  const [person, setPerson] = useState(null as SolidPerson);
  const [eigendom, setEigendom] = useState(null as SolidAddress);

  let isLoggedIn = session.info.isLoggedIn;
  let webId = session.info.webId;

  const getProfile: () => Promise<ThingPersisted> = useCallback(async () => {
    const myDataset = await getSolidDataset(webId, { fetch: session.fetch });
    const profile: ThingPersisted = getThing(myDataset, webId);

    return profile;
  }, [webId, session.fetch]);

  const getPersonInfo: (profile: ThingPersisted) => SolidPerson = useCallback(
    (profile) => {
      const name = getStringNoLocale(profile, VCARD.fn);
      const bday = getDate(profile, VCARD.bday);

      return { name, bday };
    }, []
  );

  const getEigendomInfo: (profile: ThingPersisted) => Promise<SolidAddress> =
    useCallback(
      async (profile) => {
        // Get the URL of the address, it is a different dataset than the profile (#me)
        const addressUrl = getUrl(profile, VCARD.hasAddress);

        const addressDataset = await getSolidDataset(addressUrl, {
          fetch: session.fetch,
        });
        const address = getThing(addressDataset, addressUrl);

        const streetAddress = getStringNoLocale(address, VCARD.street_address);
        const locality = getStringNoLocale(address, VCARD.locality);
        const region = getStringNoLocale(address, VCARD.region);
        const postalCode = getStringNoLocale(address, VCARD.postal_code);
        const countryName = getStringNoLocale(address, VCARD.country_name);

        return { streetAddress, locality, region, postalCode, countryName };
      }, [session.fetch]);

  // Na inloggen, check of het WebID bekend is in de database
  useEffect(() => {
    async function checkIfWebIDIsReadyForDemo(webId): Promise<void> {
      const result = await checkIfWebIDIsReady(webId);
      setIsReady(result);
    }

    async function loadData(): Promise<void> {
      const profile = await getProfile();

      const person = getPersonInfo(profile);
      const eigendom = await getEigendomInfo(profile);

      setPerson(person);
      setEigendom(eigendom);
    }

    if (isLoggedIn) {
      const result = checkIfWebIDIsReadyForDemo(webId);
      if (result) {
        loadData();
      }
    }
  }, [getEigendomInfo, getPersonInfo, getProfile, isLoggedIn, webId]);

  const registerWebIDForDemo: () => Promise<void> = async () => {
    await registerWebID(webId, person, eigendom);
    const result = await checkIfWebIDIsReady(webId);
    setIsReady(result);
  };

  return (
    <Box sx={{ flex: 1 }}>
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

      {isLoggedIn && (
        <Box>
          <Typography variant="body1" color="text.primary" align="center">
            Welkom{person && person.hasOwnProperty('name') && person.name !== null && " " + person.name}!
          </Typography>
          <pre>
            {JSON.stringify(person, null, 2)}
          </pre>
          <pre>
            {JSON.stringify(eigendom, null, 2)}
          </pre>
        </Box>
      )}
      {isLoggedIn && isReady == true && (
        <Box>
          <Stack direction="row" justifyContent="end">
            <Button
              disabled={!isLoggedIn}
              variant="contained"
              onClick={handleNext}
            >
              Doorgaan
            </Button>
          </Stack>
        </Box>
      )}
      {isLoggedIn && isReady == false && (
        <Box>
          <Typography variant="body1" color="text.primary" align="center">
            Nog niet klaar om te beginnen
          </Typography>
          <Stack direction="row" justifyContent="end">
            <Button variant="contained" onClick={registerWebIDForDemo}>
              Data klaarzetten
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
