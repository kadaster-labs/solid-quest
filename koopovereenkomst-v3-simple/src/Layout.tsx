import { SessionProvider } from "@inrupt/solid-ui-react";
import { Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Head from 'next/head';
import { useEffect, useState } from "react";
import Image from './Image';
import Link from "./Link";

export const siteTitle = 'Koopovereenkomst Solid App';

export default function Layout({ children, home, role }: {
    children: React.ReactNode,
    home?: boolean,
    role?: string,
}) {
    const [currentTab, setCurrentTab] = useState(0);

    const minimalWidth = useMediaQuery('only screen and (max-width: 1500px)');

    const footerStyle = {
        display: "flex",
        flex: 1,
        padding: "1rem 0",
        borderTop: "1px solid #ccc",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        background: "rgb(0, 44, 84)",
        color: "white",
        textAlign: "center",
        a: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            margin: "0 1rem",
            '&:hover': {
                textDecoration: "none",
            }
        }
    }

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
        <Box sx={{
            resize: "both",
            backgroundSize: "cover",
            overflow: "hidden",
            ...(!minimalWidth && {
                backgroundImage: "url(/solid-quest/images/background-lines.svg)",
                backgroundPosition: "right top",
            })
        }}>
            <SessionProvider>
                <Container maxWidth="lg" sx={{
                    maxWidth: "60rem",
                    padding: "1rem 0 3rem",
                    margin: "0 auto",
                    // minHeight: "97vh",
                    width: "100%",
                }}>
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

                    <Box sx={{
                        minHeight: "92vh",
                        padding: "4rem 0",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",

                    }}>{children}</Box>

                    <Box sx={footerStyle}  >
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
        </Box >
    );
}