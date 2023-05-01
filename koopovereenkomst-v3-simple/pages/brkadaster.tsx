import { useSession } from "@inrupt/solid-ui-react";

import { Box } from "@mui/system";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import ConnectSolid from "../src/ConnectSolid";
import Layout from "../src/Layout";
import VC, { VCType } from "../src/VC";

export default function BRKadaster() {

    const { session } = useSession();
    const [isLoggedOn, setIsLoggedOn] = useState(false);

    const refreshState = useCallback(() => {
        setIsLoggedOn(session.info.isLoggedIn);
    }, [isLoggedOn, session.info.isLoggedIn]);

    useEffect(() => {
        refreshState();
    }, [isLoggedOn, refreshState])

    return (
        <Layout role="brk">
            <Head>
                <title>{"BRK"}</title>
            </Head>
            <Box sx={{
                backgroundImage: "url('/solid-quest/images/mijnkadaster.png')",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "98rem",
                display: "block",
            }} onClick={refreshState}>
                <Box sx={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "block",
                    margin: "25rem 1rem 1rem 1rem",
                }}>
                    <Box>
                        <ConnectSolid />
                    </Box>
                    <Box>
                        {isLoggedOn &&
                            <VC type={VCType.BRK} enableDownload={true} />
                        }
                    </Box>
                </Box>
            </Box>

        </Layout>
    );
}