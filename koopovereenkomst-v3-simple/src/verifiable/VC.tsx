import { useSession } from "@inrupt/solid-ui-react";
import { useCallback, useEffect, useState } from "react";

import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CircularProgress from '@mui/material/CircularProgress';

import { deleteFile, getAllFileUrls, getFile, getRootContainerURL, saveJson } from "../Solid";
import { Signing } from "./signing";


export enum VCType {
  BRP = "Basisregistratie Personen",
  BRK = "Basisregistratie Kadaster",
}

// BRK VC does not support data minimization yet. Therefore, it is stored in public folder.
// BRP VC supports data minimization. Therefore, the VC is stored in private folder, and
// only the ZKP proof is shared with the buyer.
const VCInfo = {
  [VCType.BRP]: {
    filename: "brp-credential.jsonld",
    apiPath: "brp",
    visibility: "private",
  },
  [VCType.BRK]: {
    filename: "brk-credential.jsonld",
    apiPath: "brk",
    visibility: "public",
  },
};

export type SolidVC = {
  url: string;
  vc: any;
  status?: any;
};

interface VCProps {
  type?: VCType;
  onChange?: (vcs: SolidVC[]) => void;
  enableDownload?: boolean;
}
export default function VC({ type = VCType.BRP, onChange = (vcs: SolidVC[]) => {}, enableDownload = false }: VCProps) {
  const { session } = useSession();
  const { webId } = session.info;

  const [vcs, _setVcs] = useState([] as SolidVC[]);
  const [isLoading, setIsLoading] = useState(false);
  
  const CredentialsContainer = useCallback(() => {
    // Verkoper actors can perform data minimization. Their VCs are stored in a private folder,
    // and only share the ZKP proof with the buyer.
    // Koper actor (koos) is a special case, as it is hardcoded in the app for demo purposes.
    // No data minimization is performed for koos, so VC has to be accessible from public folder.
    if (webId === 'http://localhost:3001/koper-koos/profile/card#me') {
      return `${getRootContainerURL()}/public/credentials`;
    }
    
    if (VCInfo[type].visibility === "private") {
      return `${getRootContainerURL()}/private/credentials`;
    } else if (VCInfo[type].visibility === "public") {
      return `${getRootContainerURL()}/public/credentials`;
    } else {
      throw new Error(`Unknown VC type ${type}`);
    }
  }, [type, webId]);

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
      const verificationResult = await Signing.verifyDocument(vc);
      updatedVcs.push({ ...vcs[i], status: verificationResult });
    }
    setVCs(updatedVcs);
  }, [setVCs]);

  const listVCs = useCallback(async () => {
    const resources = await getAllFileUrls(CredentialsContainer());
    const vcs = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i].endsWith(VCInfo[type].filename)) {
        vcs.push(resources[i]);
      }
    }
    return vcs;
  }, [CredentialsContainer, type]);

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
    let result: any;
    if (response.status >= 200 && response.status < 300) {
      result = await response.json();
    } else {
      throw response;
    }

    console.log("Recieved response", result);

    return result;
  };

  const downloadVC = async () => {
    setIsLoading(true);
    const vc = await vcAPI(VCInfo[type].apiPath);
    await saveJson(`${CredentialsContainer()}/${VCInfo[type].filename}`, vc, true);

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
