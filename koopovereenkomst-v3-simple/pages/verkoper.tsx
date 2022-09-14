import { useSession } from "@inrupt/solid-ui-react";
import Head from 'next/head';
import { useState } from "react";
import KadasterKnowledgeGraph from "../components/kkg";
import Layout from '../components/layout';
import Profile from "../components/profile";
import styles from '../styles/verkoper.module.css';

// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";
import context from '@solid/context';

export default function Verkoper() {

    const title = "Verkoper Homepage";

    const { session } = useSession();
    const { webId } = session.info;

    const [caseId, setCaseId] = useState("");

    const openenKoopovereenkomst = async function () {
        console.log(`Openen van Koopovereenkomst [caseId: ${caseId}]`);

        const queryEngine = new ComunicaEngine(webId);
        // see https://github.com/LDflex/Query-Solid#adding-a-custom-json-ld-context
        const path = new PathFactory({ context, queryEngine });
        const solid = path.create({
            subject: namedNode(`${context["@context"].solid}`),
        });

        console.log(`username: ${await solid.data['https://ruben.verborgh.org/profile/#me'].firstName}`);
    }

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
                    <label>Koopovereenkomst nummer:</label>
                    <input
                        id="caseId"
                        placeholder="Koopovereenkomst Case ID"
                        defaultValue={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                    />
                    <button onClick={openenKoopovereenkomst}>Openen</button>
                </div>}

            {session.info.isLoggedIn && <Profile />}

            {session.info.isLoggedIn && <KadasterKnowledgeGraph />}

        </Layout>
    );
}
