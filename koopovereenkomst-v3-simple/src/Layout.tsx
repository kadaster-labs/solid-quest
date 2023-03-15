import { SessionProvider } from "@inrupt/solid-ui-react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Head from 'next/head';
import { useEffect, useState } from "react";
import styles from '../styles/layout.module.css';
import Image from './Image';
import Link from "./Link";

export const siteTitle = 'Koopovereenkomst Solid App';

export default function Layout({ children, home, role }: {
    children: React.ReactNode,
    home?: boolean,
    role?: string,
}) {
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        switch (role) {
            case 'verkoper':
                setCurrentTab(1);
                break;
            case 'koper':
                setCurrentTab(2);
                break;

            case 'home':
            default:
                setCurrentTab(0);
                break;
        }
    }, [role]);

    return (
        <Box className={styles.backgroundLines}>
            <SessionProvider>

                <Box className={styles.kadasterLogo}>
                    <Image
                        src="/solid-quest/images/kadaster-logo-wit.webp"
                        alt="Kadaster Logo"
                        width={300}
                        height={200}
                    />
                </Box>

                <Container maxWidth="lg" className={[styles.container, role].join(" ")}>

                    <Head>
                        <link rel="icon" href="/solid-quest/favicon.ico" />
                        <meta
                            name="description"
                            content="Discover what the SOLID specification contains and how it works by developing a working example with a 'Koopovereenkomst Solid App'"
                        />
                        <meta
                            property="og:image"
                            content={`/solid-quest/images/kadaster.svg`}
                        />
                        <meta name="og:title" content={siteTitle} />
                        <meta name="twitter:card" content="summary_large_image" />
                    </Head>
                    <main>{children}</main>

                    <Box className={styles.footer}  >
                        <Link href="/">Home</Link>
                        <Typography> | </Typography>
                        <Link href="https://labs.kadaster.nl/cases/Solid-Pods" target="_blank">
                            <Image
                                priority
                                src="/solid-quest/images/kadaster-wit.svg"
                                height={22}
                                width={22}
                                alt="Kadaster Labs"
                            />
                             Labs
                        </Link>
                    </Box>
                </Container>

            </SessionProvider>
        </Box>
    );
}