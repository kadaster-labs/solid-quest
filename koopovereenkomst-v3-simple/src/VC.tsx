import { useEffect, useCallback, useState } from "react";

import { fetch } from "@inrupt/solid-client-authn-browser";
import { useSession } from "@inrupt/solid-ui-react";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import { Link, Typography } from "@mui/material";
import { verifyVC } from "./verify";
import { deleteFile, getAllFileUrls, getFile, saveJson } from "./Solid";


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

const CredentialsContainer = 'credentials';

export default function VC({ type = VCType.BRP, onChange = (vcs: SolidVC[]) => {} }) {
  // onChange lets us let the parent know the state of the VC
  // this is not the best way to do this, but it works for now
  // According to the React docs, we should use a state management library
  // or 'lift the state up' to the parent component

  const { session } = useSession();
  const { webId } = session.info;

  const [vcs, _setVcs] = useState([] as SolidVC[]);
  const [isLoading, setIsLoading] = useState(false);

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
    const resources = await getAllFileUrls(CredentialsContainer);
    const vcs = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].endsWith(VCInfo[type].filename)) {
        vcs.push(resources[i]);
      }
    }
    return vcs;
  }, [type]);

  const loadVCs = useCallback(async (urls: string[]) => {
      const vcs = [];
      for (let i = 0; i < urls.length; i++) {
        const file = await getFile(urls[i]);
        const text = await file.text();
        const credential = JSON.parse(text);
        vcs.push({ url: urls[i], vc: credential, status: "❔" });
      }
      await refreshVCsStatus(vcs);
    },
    [refreshVCsStatus]
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
    await saveJson(`${CredentialsContainer}/${VCInfo[type].filename}`, vc, true);

    await initializeVCs();

    setIsLoading(false);
  };

  const refreshVCs = async () => {
    await initializeVCs();
  };

  const deleteVCs = async () => {
    for (let i = 0; i < vcs.length; i++) {
      const { url } = vcs[i];
      await deleteFile(url);
    }
    setVCs([]);
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Verifiable Credential(s) voor {type}
      </Typography>
      {vcs.length == 0 ? (
        isLoading ? <CircularProgress/> : <Button color="secondary" onClick={downloadVC}>VC Downloaden</Button>
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
