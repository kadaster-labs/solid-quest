import {
    CombinedDataProvider, Text, useSession
} from "@inrupt/solid-ui-react";
import { FOAF } from "@inrupt/vocab-common-rdf";

export default function Profile() {

    const { session } = useSession();
    const { webId } = session.info;

    return (
        <div>
            <h2>Solid POD Profile</h2>
            <CombinedDataProvider datasetUrl={webId} thingUrl={webId}>
                <Text property={FOAF.name} />
            </CombinedDataProvider>
        </div>
    );
}