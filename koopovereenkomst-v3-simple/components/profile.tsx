import {
    CombinedDataProvider, Text, useSession
} from "@inrupt/solid-ui-react";
import { FOAF } from "@inrupt/vocab-common-rdf";

export default function Profile() {

    const { session } = useSession();
    const { webId } = session.info;

    const path = "";// LDflex path.create()

    return (
        <div>
            <h2>Solid POD Profile</h2>
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                <ul>
                    <li><Text property={FOAF.name} /></li>
                    <li><Text property={FOAF.lastName} /></li>
                    <li><Text property={FOAF.firstName} /></li>
                    <li><Text property={FOAF.birthday} /></li>
                </ul>
            </CombinedDataProvider>
        </div>
    );
}