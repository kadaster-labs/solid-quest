import {
    CombinedDataProvider, Text, useSession
} from "@inrupt/solid-ui-react";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export default function Profile() {

    const { session } = useSession();
    const { webId } = session.info;

    const path = "";// LDflex path.create()

    return (
        <div>
            <h2>Solid POD Profile</h2>
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                <ul>
                    <li>name: <Text property={FOAF.name} /></li>
                    <li>lastname: <Text property={FOAF.lastName} /></li>
                    <li>firstname: <Text property={FOAF.firstName} /></li>
                    <li>birthday: <Text property={VCARD.bday} /></li>
                </ul>
            </CombinedDataProvider>
        </div>
    );
}