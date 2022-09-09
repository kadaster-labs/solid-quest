import Head from 'next/head';
import KadasterKnowledgeGraph from '../components/kkg';
import Layout from '../components/layout';

export default function Koper() {

    const title = "Koper Homepage";

    return (
        <Layout role="koper">
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <p>Content ...</p>
            <KadasterKnowledgeGraph></KadasterKnowledgeGraph>
        </Layout>
    );
}
