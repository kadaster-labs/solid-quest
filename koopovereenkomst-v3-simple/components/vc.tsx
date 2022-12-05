import { fetch } from '@inrupt/solid-client-authn-browser';
import {
    addStringNoLocale,
    createSolidDataset,
    createThing,
    getSolidDataset,
    getStringNoLocale,
    getThingAll,
    removeThing,
    saveSolidDatasetAt,
    setThing
} from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react";
import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';

import { IssuerApi } from '../api/vcApi';

export default function VC() {

    const { session } = useSession();
    const { webId } = session.info;
    
    console.log(webId);
    const SELECTED_POD = webId.split('profile/card#me')[0];

    const labelCreateStatus = document.querySelector("#labelCreateStatus");

    const save = async (credential: string) => {
        // Attempt at adapting https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/getting-started/
        labelCreateStatus.textContent = "";

        const credentialListUrl = `${SELECTED_POD}credentials`;

        // Fetch or create a new reading list.
        let myCredentialList;

        try {
            // Attempt to retrieve the reading list in case it already exists.
            myCredentialList = await getSolidDataset(credentialListUrl, { fetch: fetch });
            // Clear the list to override the whole list
            let items = getThingAll(myCredentialList);
            items.forEach((item) => {
                console.log(item);
                myCredentialList = removeThing(myCredentialList, item);
            });
        } catch (error) {
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
            // if not found, create a new SolidDataset (i.e., the reading list)
            myCredentialList = createSolidDataset();
            } else {
            console.error(error.message);
            }
        }


        // Add credential to the Dataset
        if (credential.trim() !== "") {
            let item = createThing({ name: "credential" });
            item = addStringNoLocale(item, SCHEMA_INRUPT.name, credential);
            myCredentialList = setThing(myCredentialList, item);
        }


        try {
            // Save the SolidDataset
            let savedCredentialList = await saveSolidDatasetAt(
                credentialListUrl,
                myCredentialList,
                { fetch: fetch }
            );

            labelCreateStatus.textContent = "✅ Saved";

            // Refetch the Reading List
            savedCredentialList = await getSolidDataset(credentialListUrl, { fetch: fetch });

            let items = getThingAll(savedCredentialList);

            let listcontent = "";
            for (let i = 0; i < items.length; i++) {
                let item = getStringNoLocale(items[i], SCHEMA_INRUPT.name);
                if (item !== null) {
                listcontent += item + "\n";
                }
            }

            document.getElementById("savedcredentials").value = listcontent;
            document.getElementById("labelTextarea").textContent = "POD Content ↪";
            document.getElementById("labelTextarea").href = credentialListUrl;
        } catch (error) {
            console.log(error);
            labelCreateStatus.textContent = "Error" + error;
            labelCreateStatus.setAttribute("role", "alert");
        }
    }


    const vcAPI = async () => {
        const api = new IssuerApi({ basePath: "http://localhost:8080" });
        const credential = await api.issueCredential();
        console.log("Recieved credential", credential);

        await save(JSON.stringify(credential));
        console.log("Saved credential");
    }

    return (
        <div>
            <h2>Verifiable Credentials</h2>
            <button onClick={vcAPI} title="VC API">Get VC and store in POD</button>
            <span id="labelCreateStatus"></span>
            <hr/>
            <a id="labelTextarea"></a><br/>
            <textarea id="savedcredentials" name="savedcredentials" rows={5} cols={42} disabled></textarea>
        </div>
    );
}
