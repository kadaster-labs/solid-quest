import {
  createContainerAt,
  deleteFile,
  deleteSolidDataset,
  getContainedResourceUrlAll,
  getFile,
  getSolidDataset,
  getSourceUrl, overwriteFile
} from "@inrupt/solid-client";
import { fetch as solidFetch } from "@inrupt/solid-client-authn-browser";
import { useSession } from "@inrupt/solid-ui-react";

import { useCallback, useEffect, useState } from "react";

import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from '@mui/material/CircularProgress';
import { verifyVC } from "./verify";

export async function deleteRecursively(dataset) {
  console.log(dataset);
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(
    containedResourceUrls.map(async (resourceUrl) => {
      try {
        return await getSolidDataset(resourceUrl, { fetch: solidFetch });
      } catch (e) {
        // The Resource might not have been a SolidDataset;
        // we can delete it directly:
        await deleteFile(resourceUrl, { fetch: solidFetch });
        return null;
      }
    })
  );
  await Promise.all(
    containedDatasets.map(async (containedDataset) => {
      if (containedDataset === null) {
        return;
      }
      return await deleteRecursively(containedDataset);
    })
  );
  return await deleteSolidDataset(dataset, { fetch: solidFetch });
}

export enum VCType {
  BRP = "Basisregistratie Personen",
  BRK = "Basisregistratie Kadaster",
}

const VCInfo = {
  [VCType.BRP]: {
    filename: "brp-credential.jsonld",
    apiPath: "brp",
  },
  [VCType.BRK]: {
    filename: "brk-credential.jsonld",
    apiPath: "brk",
  },
};

export type SolidVC = {
  url: string;
  vc: any;
  status: any;
};

export default function VC({ type = VCType.BRP, onChange = (vcs: SolidVC[]) => { }, enableDownload = false }) {
  // onChange lets us let the parent know the state of the VC
  // this is not the best way to do this, but it works for now
  // According to the React docs, we should use a state management library
  // or 'lift the state up' to the parent component

  const { session } = useSession();
  const { webId } = session.info;

  const [vcs, _setVcs] = useState([] as SolidVC[]);
  const [isLoading, setIsLoading] = useState(false);

  const SELECTED_POD = webId?.split("profile/card#me")[0];
  const targetContainerURL = `${SELECTED_POD}credentials/`;

  const setVCs = useCallback(async (vcs: any) => {
    onChange(vcs);
    _setVcs(vcs);
  },
    [onChange]
  );

  const refreshVCsStatus = useCallback(async (vcs) => {
    const updatedVcs = [];
    for (let i = 0; i < vcs.length; i++) {
      const { vc } = vcs[i];
      const verificationResult = await verifyVC(vc);
      console.log("refreshing status", verificationResult);
      updatedVcs.push({ ...vcs[i], status: verificationResult });
    }
    setVCs(updatedVcs);
  }, [setVCs]);

  const listVCs = useCallback(async () => {
    const vcs = [];
    await getSolidDataset(targetContainerURL, { fetch: solidFetch })
      .then((dataset) => {
        const containedResourceUrls = getContainedResourceUrlAll(dataset);
        containedResourceUrls.forEach((resourceUrl) => {
          resourceUrl.endsWith(VCInfo[type].filename) && vcs.push(resourceUrl);
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return vcs;
  }, [targetContainerURL, type]);

  const loadVCs = useCallback(async (urls: string[]) => {
    const vcs = [];
    for (let i = 0; i < urls.length; i++) {
      const file = await getFile(urls[i], { fetch: solidFetch });
      const text = await file.text();
      const credential = JSON.parse(text);
      vcs.push({ url: urls[i], vc: credential, status: "❔" });
    }
    await refreshVCsStatus(vcs);
  },
    []
  );

  const initializeVCs = useCallback(async () => {
    const vcUrls = await listVCs();
    if (vcUrls.length > 0) {
      try {
        await loadVCs(vcUrls);
      } catch (error) {
        console.log(error);
      }
    }
  }, [listVCs, loadVCs]);

  useEffect(() => {
    // This function will run when the component mounts
    initializeVCs();
  }, [initializeVCs]);

  const save_jsonld_file = async (filename: string, credential: any) => {
    // Create Container to place VC in
    try {
      const container = await getSolidDataset(targetContainerURL, {
        fetch: solidFetch,
      });
    } catch (error) {
      await createContainerAt(targetContainerURL, { fetch: solidFetch });
    }

    // Upload file into the targetContainer.
    console.log("json stringify credential", credential);
    const blob = new Blob([JSON.stringify(credential, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    try {
      let savedFile = await overwriteFile(
        `${targetContainerURL}${filename}`, // Container URL
        blob, // File
        { contentType: "application/ld+json", fetch: solidFetch }
      );
      console.log(`File saved at ${getSourceUrl(savedFile)}`);
      return savedFile;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  };

  const vcAPI = async (service: string) => {
    const response = await fetch(
      `http://localhost:8080/${service}/credentials/issue/${encodeURIComponent(
        webId
      )}`
    );
    let result;
    if (response.status >= 200 && response.status < 300) {
      result = await response.json();
    } else {
      throw response;
    }

    console.log("Recieved response", result);

    return result.verifiableCredential;
  };

  const downloadVC = async () => {
    setIsLoading(true);
    const vc = await vcAPI(VCInfo[type].apiPath);
    const savedFile = await save_jsonld_file(VCInfo[type].filename, vc);

    console.log(`File saved for ${VCInfo[type]} at ${getSourceUrl(savedFile)}`);

    // keep running the listVCs loop until the file is found
    // this is a workaround for the fact that the file is not immediately available
    let vcUrls = [];
    while (vcUrls.length == 0) {
      vcUrls = await listVCs();

      // wait 1 second before trying again
      console.log("waiting for vc to be saved", vcUrls);
      if (vcUrls.length == 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    await initializeVCs();
    setIsLoading(false);
  };

  const refreshVCs = async () => {
    await initializeVCs();
  };

  const deleteVCs = async () => {
    for (let i = 0; i < vcs.length; i++) {
      const { url } = vcs[i];
      console.log("delete", url);
      await deleteFile(url, { fetch: solidFetch });
    }
    setVCs([]);
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Verifiable Credential(s) voor {type}
      </Typography>
      {vcs.length == 0 ? (
        isLoading ? <CircularProgress /> : (
          enableDownload ? <Button color="secondary" onClick={downloadVC}>VC Downloaden</Button> :
            <Box>
              <Typography>Geen VC gevonden!</Typography>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button color="secondary" onClick={refreshVCs}>
                  Status verversen
                </Button>
              </ButtonGroup>
            </Box>)
      ) : (
        <ButtonGroup variant="text" aria-label="text button group">
          <Link href={vcs[0].url} target="_blank">
            <Button color="secondary">
              VC Bekijken
            </Button>
          </Link>
          <Button color="secondary" onClick={refreshVCs}>
            Status verversen
          </Button>
          <Button color="secondary" onClick={deleteVCs}>
            VC Verwijderen
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
}
