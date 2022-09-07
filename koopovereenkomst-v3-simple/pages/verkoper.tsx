import Head from 'next/head';
import Layout from '../components/layout';

export default function Verkoper() {

    const title = "Verkoper Homepage";

    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <p>Content ...</p>
        </Layout>
    );
}
