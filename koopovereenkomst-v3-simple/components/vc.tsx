import { fetch } from '@inrupt/solid-client-authn-browser';
import {
    createContainerAt,
    deleteFile,
    deleteSolidDataset,
    getContainedResourceUrlAll,
    getFile,
    getSolidDataset,
    getSourceUrl,
    saveFileInContainer
} from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react";

import { IssuerApi, VerifiableCredential } from '../api/vcApi';


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
    const labelCreateStatus = document.querySelector("#labelCreateStatus");

    const save_jsonld_file = async (credential: VerifiableCredential) => {
      labelCreateStatus.textContent = "";

      const credentialListUrl = `${SELECTED_POD}credentials`;
      const targetContainerURL = `${SELECTED_POD}credentialsjsonld/`;
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

      let savedFile;
      try {
        savedFile = await saveFileInContainer(
          targetContainerURL,           // Container URL
          blob,                         // File
          { slug: "kadasterVC.jsonld", contentType: "application/ld+json", fetch: fetch }
        );
        console.log(`File saved at ${getSourceUrl(savedFile)}`);

        labelCreateStatus.textContent = "✅ Saved";
      } catch (error) {
        console.error(error);
      }

      // Read File from POD
      try {
        const fileBlob = await getFile(getSourceUrl(savedFile), { fetch });
        const tekst = await fileBlob.text();
        const content = JSON.parse(tekst);

        (document.getElementById("savedcredentials") as HTMLPreElement).textContent = JSON.stringify(content, null, 2);
        (document.getElementById("labelTextarea") as HTMLAnchorElement).textContent = "POD Content ↪";
        (document.getElementById("labelTextarea") as HTMLAnchorElement).href = credentialListUrl;
      } catch (error) {
        console.log(error);
        labelCreateStatus.textContent = "Error" + error;
        labelCreateStatus.setAttribute("role", "alert");
      }
    }

    const vcAPI = async () => {
        const api = new IssuerApi({ basePath: "http://localhost:8080" });
        const credential = await api.issueCredential() as VerifiableCredential;
        console.log("Recieved credential", credential);

        await save_jsonld_file(credential)
        console.log("Saved credential");
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
