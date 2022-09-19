import { getInteger, getSolidDataset, getThingAll, isThing } from '@inrupt/solid-client';
import { useSession } from "@inrupt/solid-ui-react";
import Head from 'next/head';
import { useEffect, useState } from "react";
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
// import context from '@solid/context';

const prefix = {
    marc: "https://marcvanandel.solidcommunity.net/",
    janneke: "https://janneke.solidcommunity.net/",
    zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
    mak: "https://mak.zorgeloosvastgoed.nl/id/concept/",
    sor: "https://data.kkg.kadaster.nl/sor/model/def/",
    id: "https://id.inrupt.com/",
    kluis: "https://storage.inrupt.com/8fe56928-30cb-4218-8afb-2f5583e21435/",
    nen3610: "https://data.kkg.kadaster.nl/nen3610/model/def/",
    geo: "http://www.opengis.net/ont/geosparql#",
};

const context = {
    "@context": {
        ...prefix,
        koomsom: {
            "@id": "zvg:koomsom",
            "@type": "xsd:integer",
        },
    },
};

const zvg_base = 'http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'
const zvg = {
    koopsom: zvg_base + 'koopsom',
}

export default function Verkoper() {

    const title = "Verkoper Homepage";

    const { session } = useSession();
    const webId = session.info.webId;

    const [podUrl, setPodUrl] = useState("");

    const [caseId, setCaseId] = useState("");

    const koopovereenkomstFile = () =>{
        return `${podUrl}koopovereenkomst-${caseId}.ttl`;
    }
    // const koopovereenkomstFile = 'https://marcvanandel.solidcommunity.net/zorgeloosvastgoed/koopovereenkomst-123.ttl';

    const openenKoopovereenkomstWithInruptSolidClient = async function () {
        const theKO = await getSolidDataset(koopovereenkomstFile());
        // const theKO = await getSolidDataset(`https://marcvanandel.solidcommunity.net/zorgeloosvastgoed/koopovereenkomst-${caseId}.ttl`)


        if (isThing(theKO)) {
            alert('Deze koopovereenkomst bestaat!')
        }
        else {
            alert('Deze koopovereenkomst bestaat NIET! Aanmaken?')
        }

        for (const thing of getThingAll(theKO)) {
            // console.log(JSON.stringify(thing));
            // De koper vraagt specifiek de koopsom op.
            const koopsom = getInteger(thing, zvg.koopsom)
            if (koopsom) {
                console.log(`Koopsom: ${koopsom}`)
            }
        }
    }

    const openenKoopovereenkomstWithLDflex = async function () {
        console.log(`Openen van Koopovereenkomst [caseId: ${caseId}]`);

        const queryEngine = new ComunicaEngine(koopovereenkomstFile());
        // see https://github.com/LDflex/Query-Solid#adding-a-custom-json-ld-context
        const path = new PathFactory({ context, queryEngine });
        const ko = path.create({
            subject: namedNode(`${prefix.zvg}koopovereenkomst`),
        });

        console.log(`iets uit de ttl: ${await ko.koopsom}`);

        // const ruben = solid.data['https://ruben.verborgh.org/profile/#me'];
        // console.log(await ruben.name);

        // console.log(`username: ${await solid.data['https://ruben.verborgh.org/profile/#me'].firstName}`);
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
                    <button onClick={openenKoopovereenkomstWithLDflex}>Openen met LDflex</button>
                    <button onClick={openenKoopovereenkomstWithInruptSolidClient}>Openen met Inrupt Solid Client</button>
                </div>}

            {session.info.isLoggedIn && <Profile />}

            {session.info.isLoggedIn && <KadasterKnowledgeGraph />}

        </Layout>
    );
}
