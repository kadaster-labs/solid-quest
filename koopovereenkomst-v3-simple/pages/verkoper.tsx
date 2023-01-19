import { getInteger, getSolidDataset, getThingAll } from '@inrupt/solid-client';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { useSession } from "@inrupt/solid-ui-react";
import Head from 'next/head';
import { useEffect, useState } from "react";
import { SOLID_ZGV_CONTEXT } from '../aggregate/context';
import KadasterKnowledgeGraph from "../components/kkg";
import Layout from '../components/layout';
import Profile from "../components/profile";
import VC from '../components/vc';
import styles from '../styles/verkoper.module.css';

import { default as data } from "@solid/query-ldflex/lib/exports/rdflib";
import KoopovereenkomstAggregate from '../aggregate/koopovereenkomst-aggregate';

const zvg_base = 'http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'
const zvg = {
    koopsom: zvg_base + 'koopsom',
}

interface Case {
    caseId?: string;
    koopsom?: number;
}

export default function Verkoper() {

    const title = "Verkoper Homepage";

    const { session } = useSession();
    const webId = session.info.webId;

    const [podUrl, setPodUrl] = useState("");
    const [caseId, setCaseId] = useState("");
    const [curCase, setCase] = useState<Case>({} as Case);
    const [errors, setErrors] = useState("");
    const [eventLabels, setEventLabels] = useState([]);


    const koopovereenkomstFile = () => {
        return `${podUrl}koopovereenkomst-${caseId}.ttl`;
    }

    const openenKoopovereenkomstWithInruptSolidClient = async function () {
        try {

            setCase({});

            const theKO = await getSolidDataset(koopovereenkomstFile(), { fetch: fetch });

            setCase(prevState => ({
                ...prevState,
                caseId: caseId,
            }));

            for (const thing of getThingAll(theKO)) {
                // console.log(JSON.stringify(thing));
                // De koper vraagt specifiek de koopsom op.
                const koopsom = getInteger(thing, zvg.koopsom)
                if (koopsom) {
                    console.log(`Koopsom: ${koopsom}`);
                    // alert(`Koopsom: ${koopsom}`);
                    setCase(prevState => ({
                        ...prevState,
                        koopsom: koopsom,
                    }))
                }
            }
        } catch (error) {
            setErrors('Error opening koopovereenkomst! ' + error);
            throw error;
        }
    }

    const openenKoopovereenkomstWithLDflex = async function () {
        try {
            console.log(`Openen van Koopovereenkomst [caseId: ${caseId}]`);

            const pod = webId.split('/profile/card#me')[0];
            const ko = data[`${pod}/koopovereenkomst/id/${caseId}`];

            const aggregate = new KoopovereenkomstAggregate(ko, pod);

            try {
                console.log("\nGENERATED BY");
                for await (const eventUri of ko.wasGeneratedBy) {
                    await aggregate.handleEvent(eventUri);
                }

                setEventLabels(aggregate.getEvents());

                console.log(aggregate.getEvents());
            } catch (error) {
                setErrors('Error handling events of koopovereenkomst! ' + error);
                console.error('Error handling events of koopovereenkomst!', error);
            }

            console.log(`\nAANGEBODEN DOOR: ${await ko.aangebodenDoor}`);
            console.log(`\nAAN: ${await ko.aan}`);
            console.log(`\nKOOPPRIJS: ${await ko.koopprijs}`);

            console.log('dump JSON+LD', await aggregate.dumpJsonLD());
            console.log('dump NQuads', await aggregate.dumpNQuads());

        } catch (error) {
            setErrors('Error opening koopovereenkomst! ' + error);
            throw error;
        }
    }

    useEffect(() => {
        if (webId !== "") {
            try {
                const url = new URL(webId);
                const thePodUrl = webId.split(url.pathname)[0] + "/";
                console.debug('The POD url is: ', thePodUrl);
                setPodUrl(thePodUrl);
            } catch (error) {

            }

            // https://github.com/LDflex/Query-Solid#adding-a-custom-json-ld-context
            data.context.extend(SOLID_ZGV_CONTEXT);
        }
    }, [podUrl, webId]);

    return (
        <Layout role="verkoper">
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>

            {!session.info.isLoggedIn && <p>NOT logged in</p>}

            {session.info.isLoggedIn &&
                <div className={styles.koopovereenkomstMain}>
                    <p>logged in: {webId}</p>
                    <p>POD url: {podUrl}</p>
                    <label>Koopovereenkomst nummer:</label>
                    <input
                        id="caseId"
                        placeholder="Koopovereenkomst Case ID"
                        defaultValue={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                    />
                    <button onClick={openenKoopovereenkomstWithLDflex}>Openen met LDflex (with console logging)</button>
                    <button disabled onClick={openenKoopovereenkomstWithInruptSolidClient}>Openen met Inrupt Solid Client</button>
                    <div>
                        <ul>
                            {eventLabels.map((e, i) => <li key={i}><a href={e.id} target='_blank' rel='noreferrer'>{e.newLabel}</a></li>)}
                        </ul>
                    </div>
                    {errors !== "" && <div className={styles.errors}>
                        <p>{errors}</p>
                        <button onClick={() => setErrors("")}>clear</button>
                    </div>
                    }
                    {curCase.caseId && <div className={styles.info}>
                        <p>Koopovereenkomst info (from {koopovereenkomstFile()}):</p>
                        <ul>
                            <li>Koopsom: {curCase.koopsom}</li>
                        </ul>
                    </div>
                    }
                </div>}

            {session.info.isLoggedIn && <Profile />}

            {session.info.isLoggedIn && <KadasterKnowledgeGraph />}

            {session.info.isLoggedIn && <VC />}

        </Layout>
    );
}
