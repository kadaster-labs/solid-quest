import { fetch as solidFetch } from '@inrupt/solid-client-authn-browser';
import {
    createContainerAt,
    deleteFile,
    deleteSolidDataset,
    getContainedResourceUrlAll,
    getFile,
    getSolidDataset,
    getSourceUrl,
    saveFileInContainer,
    overwriteFile,
    WithResourceInfo,
} from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react";
import Button from "@mui/material/Button";
import PodIcon from "./PodIcon";
import { useEffect, useState } from "react";
import { Box } from '@mui/material';


export async function deleteRecursively(dataset) {
  console.log(dataset);
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(containedResourceUrls.map(async resourceUrl => {
    try {
      return await getSolidDataset(resourceUrl, { fetch: solidFetch });
    } catch(e) {
      // The Resource might not have been a SolidDataset;
      // we can delete it directly:
      await deleteFile(resourceUrl, { fetch: solidFetch });
      return null;
    }
  }));
  await Promise.all(containedDatasets.map(async containedDataset => {
    if (containedDataset === null) {
      return;
    }
    return await deleteRecursively(containedDataset);
  }));
  return await deleteSolidDataset(dataset, { fetch: solidFetch });
}

export enum VCType {
  BRP = 'Basisregistratie Personen',
  BRK = 'Basisregistratie Kadaster',
}

export default function VC({ type = VCType.BRP, handleVC = (vc) => { } }) {

    const { session } = useSession();
    const { webId } = session.info;

    const [VCUrl, setVCUrl] = useState("");

    const SELECTED_POD = webId.split('profile/card#me')[0];
    const targetContainerURL = `${SELECTED_POD}credentials/`;

    const save_jsonld_file = async (filename: string, credential: any) => {
      // Create Container to place VC in
      try {
        const container = await getSolidDataset(targetContainerURL, { fetch: solidFetch });
        // await deleteRecursively(container);
        // await createContainerAt(targetContainerURL, { fetch: solidFetch });
      } catch (error) {
        console.error(error);
        await createContainerAt(targetContainerURL, { fetch: solidFetch });
      }

      // Upload file into the targetContainer.
      console.log('json stringify credential', credential)
      const blob = new Blob([JSON.stringify(credential, null, 2)], {type: "application/json;charset=utf-8"});

      try {
        let savedFile = await overwriteFile(
          `${targetContainerURL}${filename}`,           // Container URL
          blob,                         // File
          { contentType: "application/ld+json", fetch: solidFetch }
        );
        console.log(`File saved at ${getSourceUrl(savedFile)}`);
        return savedFile;
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }

    async function readSolidVC(file: Blob & WithResourceInfo) {
      if (!file) {
        return;
      }

      const fileBlob = await getFile(getSourceUrl(file), { fetch: solidFetch });
      const tekst = await fileBlob.text();
      const content = JSON.parse(tekst);

      return content;
    }

    const vcAPI = async (service: string) => {
        const response = await fetch(`http://localhost:8080/${service}/credentials/issue/${encodeURIComponent(webId)}`)
        let result;
        if (response.status >= 200 && response.status < 300) {
            result = await response.json();
        } else {
            throw response;
        }

        console.log("Recieved response", result);

        return result.verifiableCredential;
    }

    const vcAPIBRP = async () => {
      const vc = await vcAPI('brp');
      const savedFile = await save_jsonld_file('brp-credential.jsonld', vc);

      console.log("Saved BRP credential");

      console.log(savedFile.internal_resourceInfo.sourceIri);
      setVCUrl(savedFile.internal_resourceInfo.sourceIri);
      handleVC(vc);
    }

    const vcAPIBRK = async () => {
      const vc = await vcAPI('brk');
      const savedFile = await save_jsonld_file('brk-credential.jsonld', vc);

      console.log("Saved BRK credential");

      setVCUrl(savedFile.internal_resourceInfo.sourceIri);
      handleVC(vc);
    }

    return (
        <Box sx={{textAlign: "center"}}>
            {type === VCType.BRP &&
            <div>
              <p>
                Deze verifiable credential is op basis van de Basisregistratie Personen (BRP).
              </p>
              { !VCUrl &&
              <p>
                <Button variant="contained" color="secondary" onClick={vcAPIBRP}>Persoonsgegevens ophalen</Button>
              </p>
              }
              {VCUrl &&
              <p>
                <span>✅ Opgeslagen! ➡</span>
                <PodIcon sx={{ mx: "1rem", verticalAlign: "middle" }} href={VCUrl} />
                <em>👈 Tip: klik op het kluisje om de data in je kluis te bekijken!</em>
              </p>
              }
            </div>
            }

            {type === VCType.BRK &&
            <div>
              <p>
                Deze verifiable credential is op basis van de Basisregistratie Kadaster (BRK).
              </p>
              {!VCUrl &&
              <p>
                <Button variant="contained" color="secondary" onClick={vcAPIBRK}>Eigendomsgegevens ophalen</Button>
              </p>
              }
              {VCUrl &&
              <p>
                <span>✅ Opgeslagen! ➡</span>
                <PodIcon sx={{ mx: "1rem", verticalAlign: "middle" }} href={VCUrl} />
              </p>
              }
            </div>
            }
        </Box>
    );
}
