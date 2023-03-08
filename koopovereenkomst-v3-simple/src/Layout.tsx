import { SessionProvider } from "@inrupt/solid-ui-react";
import AddHomeIcon from '@mui/icons-material/AddHome';
import HomeIcon from '@mui/icons-material/Home';
import SellIcon from '@mui/icons-material/Sell';
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Head from 'next/head';
import { useEffect, useState } from "react";
import styles from '../styles/layout.module.css';
import Image from './Image';
import Link, { NextLinkComposed } from "./Link";

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

                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation
                            showLabels
                            value={currentTab}
                            onChange={(event, newValue) => {
                                setCurrentTab(newValue);
                            }}
                        >
                            <BottomNavigationAction label="Home" icon={<HomeIcon />} component={NextLinkComposed} to="/" />
                            <BottomNavigationAction label="Verkoper" icon={<SellIcon />} component={NextLinkComposed} to="/verkoper" />
                            <BottomNavigationAction label="Koper" icon={<AddHomeIcon />} component={NextLinkComposed} to="/koper_oud" />
                        </BottomNavigation>
                    </Paper>
                </Container>

            </SessionProvider>
        </Box>
    );
}