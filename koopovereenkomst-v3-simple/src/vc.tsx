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

export default function VC() {

    const { session } = useSession();
    const { webId } = session.info;

    const SELECTED_POD = webId.split('profile/card#me')[0];
    const targetContainerURL = `${SELECTED_POD}credentials/`;
    const labelCreateStatus = document.querySelector("#labelCreateStatus");

    const save_jsonld_file = async (filename: string, credential: any) => {
      labelCreateStatus.textContent = "";

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
          `${targetContainerURL}/${filename}`,           // Container URL
          blob,                         // File
          { contentType: "application/ld+json", fetch: solidFetch }
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

      
      try {
        const content = await readSolidVC(savedFile);

        (document.getElementById("savedcredentialsbrp") as HTMLPreElement).textContent = JSON.stringify(content, null, 2);
        (document.getElementById("labelTextareabrp") as HTMLAnchorElement).textContent = "POD Content ↪";
        (document.getElementById("labelTextareabrp") as HTMLAnchorElement).href = savedFile.internal_resourceInfo.sourceIri;
      } catch (error) {
        console.log(error);
        labelCreateStatus.textContent = "Error" + error;
        labelCreateStatus.setAttribute("role", "alert");
      }
    }
    
    const vcAPIBRK = async () => {
      const vc = await vcAPI('brk');
      const savedFile = await save_jsonld_file('brk-credential.jsonld', vc);
      console.log("Saved BRK credential");

      try {
        const content = await readSolidVC(savedFile);

        (document.getElementById("savedcredentialsbrk") as HTMLPreElement).textContent = JSON.stringify(content, null, 2);
        (document.getElementById("labelTextareabrk") as HTMLAnchorElement).textContent = "POD Content ↪";
        (document.getElementById("labelTextareabrk") as HTMLAnchorElement).href = savedFile.internal_resourceInfo.sourceIri;
      } catch (error) {
        console.log(error);
        labelCreateStatus.textContent = "Error" + error;
        labelCreateStatus.setAttribute("role", "alert");
      }
    }

    const loadVC = async () => {
      const uri = `${targetContainerURL}kadasterVC.jsonld`;
      const file = await getFile(uri, { fetch: solidFetch });
      await readSolidVC(file);
    }

    // try {
    //   loadVC();
    // } catch (error) {
    //   // Ignore
    // }

    return (
        <div>
            <h2>Verifiable Credentials</h2>
            <span id="labelCreateStatus"></span>
            <h3>BRP</h3>
            <button onClick={vcAPIBRP} title="VC API">Get BRP VC and store in POD</button>
            <hr/>
            <a id="labelTextareabrp"></a><br/>
            <pre id="savedcredentialsbrp"></pre>
            <hr/>
            <h3>BRK</h3>
            <button onClick={vcAPIBRK} title="VC API">Get BRK VC and store in POD</button>
            <hr/>
            <a id="labelTextareabrk"></a><br/>
            <pre id="savedcredentialsbrk"></pre>
        </div>
    );
}
