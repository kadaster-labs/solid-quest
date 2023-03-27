import { LogoutButton, useSession } from "@inrupt/solid-ui-react";
import { Box, Button, Typography } from "@mui/material";
import Link from "./Link";
import LoginForm from './LoginForm';

export default function ConnectSolid() {

    const { session, sessionRequestInProgress } = useSession();
    const webId = session.info.webId;

    return (
        <Box>
            {!sessionRequestInProgress && session.info.isLoggedIn && (
                <Box sx={{ p: "2rem", display: "flex", justifyContent: "center", button: { m: "2rem" } }}>
                    <LogoutButton onError={console.error} onLogout={() => window.location.reload()}>
                        <Button variant="contained">Log Out</Button>
                    </LogoutButton>
                    <Link href={webId} target="_blank" rel="noreferrer">
                        <Button variant="contained">Open WebID</Button>
                    </Link>
                </Box>
            )}

            {!sessionRequestInProgress && !session.info.isLoggedIn && <LoginForm />}
        </Box>

    );
}