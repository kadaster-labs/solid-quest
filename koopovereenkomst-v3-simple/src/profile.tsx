import {
    CombinedDataProvider, Text, useSession, Value
} from "@inrupt/solid-ui-react";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export default function Profile() {

    const { session } = useSession();
    const { webId } = session.info;

    const logError = async function (e) {
        console.log(`error gebeurt`, e);
    }

    return (
        <div>
            <h2>Solid POD Profile</h2>
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                <ul>
                    <li>name (foaf): <Text property={FOAF.name} /></li>
                    <li>name (vcard): <Text property={VCARD.fn} /></li>
                    {/* <li>lastname: <Text property={FOAF.lastName} /></li>
                    <li>firstname: <Text property={FOAF.firstName} /></li> */}
                    <li>birthday: <Value property={VCARD.bday} dataType="datetime" /></li>
                </ul>
            </CombinedDataProvider>
        </div>
    );
}