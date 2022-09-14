import {
    CombinedDataProvider, Text, useSession
} from "@inrupt/solid-ui-react";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export default function Profile() {

    const { session } = useSession();
    const { webId } = session.info;

    return (
        <div>
            <h2>Solid POD Profile</h2>
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                <ul>
                    <li>name (foaf): <Text property={FOAF.name} /></li>
                    <li>name (vcard): <Text property={VCARD.fn} /></li>
                    {/* <li>lastname: <Text property={FOAF.lastName} /></li>
                    <li>firstname: <Text property={FOAF.firstName} /></li> */}
                    <li>birthday: <Text property={VCARD.bday} /></li>
                </ul>
            </CombinedDataProvider>
        </div>
    );
}