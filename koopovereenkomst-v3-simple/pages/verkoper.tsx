import { useSession } from "@inrupt/solid-ui-react";
import Head from 'next/head';
import KadasterKnowledgeGraph from "../components/kkg";
import Layout from '../components/layout';
import Profile from "../components/profile";

export default function Verkoper() {

    const title = "Verkoper Homepage";

    const { session } = useSession();

    return (
        <Layout role="verkoper">
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <p>Content ...</p>

            {!session.info.isLoggedIn && <p>NOT logged in</p>}

            {session.info.isLoggedIn && <p>logged in</p>}

            {session.info.isLoggedIn && <Profile />}

            {session.info.isLoggedIn && <KadasterKnowledgeGraph />}

        </Layout>
    );
}
