import Head from 'next/head';
import KadasterKnowledgeGraph from '../src/KadasterKnowledgeGraph';
import Layout from '../src/Layout';

export default function Koper() {

    const title = "Koper Homepage";

    return (
        <Layout role="koper">
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <p>Content ...</p>
        </Layout>
    );
}
