import { fetch } from '@inrupt/solid-client-authn-browser';
import {
    createContainerAt,
    deleteFile,
    deleteSolidDataset,
    getContainedResourceUrlAll,
    getFile,
    getSolidDataset,
    getSourceUrl,
    saveFileInContainer,
    WithResourceInfo,
} from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react";

import {
  GovernmentAgency,
  IssuerCredentialsApi,
  VerifiableCredential,
} from '../api/vcApi';


export async function deleteRecursively(dataset) {
  console.log(dataset);
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(containedResourceUrls.map(async resourceUrl => {
    try {
      return await getSolidDataset(resourceUrl, { fetch });
    } catch(e) {
      // The Resource might not have been a SolidDataset;
      // we can delete it directly:
      await deleteFile(resourceUrl, { fetch });
      return null;
    }
  }));
  await Promise.all(containedDatasets.map(async containedDataset => {
    if (containedDataset === null) {
      return;
    }
    return await deleteRecursively(containedDataset);
  }));
  return await deleteSolidDataset(dataset, { fetch });
}

export default function VC() {

    const { session } = useSession();
    const { webId } = session.info;

    const SELECTED_POD = webId.split('profile/card#me')[0];
    const targetContainerURL = `${SELECTED_POD}credentials/`;
    const labelCreateStatus = document.querySelector("#labelCreateStatus");

    const save_jsonld_file = async (credential: VerifiableCredential) => {
      labelCreateStatus.textContent = "";

      // Create Container to place VC in
      try {
        const container = await getSolidDataset(targetContainerURL, { fetch });
        await deleteRecursively(container);
        await createContainerAt(targetContainerURL, { fetch });
      } catch (error) {
        console.error(error);
        await createContainerAt(targetContainerURL, { fetch });
      }

      // Upload file into the targetContainer.
      const blob = new Blob([JSON.stringify(credential, null, 2)], {type: "application/json;charset=utf-8"});

      try {
        let savedFile = await saveFileInContainer(
          targetContainerURL,           // Container URL
          blob,                         // File
          { slug: "kadasterVC.jsonld", contentType: "application/ld+json", fetch: fetch }
        );
        console.log(`File saved at ${getSourceUrl(savedFile)}`);

        labelCreateStatus.textContent = "✅ Saved";
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

      try {
        const fileBlob = await getFile(getSourceUrl(file), { fetch });
        const tekst = await fileBlob.text();
        const content = JSON.parse(tekst);

        (document.getElementById("savedcredentials") as HTMLPreElement).textContent = JSON.stringify(content, null, 2);
        (document.getElementById("labelTextarea") as HTMLAnchorElement).textContent = "POD Content ↪";
        (document.getElementById("labelTextarea") as HTMLAnchorElement).href = file.internal_resourceInfo.sourceIri;
      } catch (error) {
        console.log(error);
        labelCreateStatus.textContent = "Error" + error;
        labelCreateStatus.setAttribute("role", "alert");
      }
    }

    const vcAPI = async () => {
        const api = new IssuerCredentialsApi({ basePath: "http://localhost:8080" });
        const response = await api.issueCredential(GovernmentAgency.Kadaster, webId);
        console.log("Recieved response", response);

        const savedFile = await save_jsonld_file(response.verifiableCredential);
        console.log("Saved credential");

        await readSolidVC(savedFile);
    }

    const loadVC = async () => {
      const uri = `${targetContainerURL}kadasterVC.jsonld`;
      const file = await getFile(uri, { fetch });
      await readSolidVC(file);
    }

    try {
      loadVC();
    } catch (error) {
      // Ignore
    }

    return (
        <div>
            <h2>Verifiable Credentials</h2>
            <button onClick={vcAPI} title="VC API">Get VC and store in POD</button>
            <span id="labelCreateStatus"></span>
            <hr/>
            <a id="labelTextarea"></a><br/>
            <pre id="savedcredentials"></pre>
        </div>
    );
}
