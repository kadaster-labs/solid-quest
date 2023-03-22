import {
    LoginButton
} from "@inrupt/solid-ui-react";
import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { siteTitle } from "./Layout";

export default function LoginForm() {

    const [idp, setIdp] = useState("http://localhost:3001");
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        const url = window.location.href;
        setCurrentUrl(url);
        console.debug("updated currentUrl to: ", url);
    }, [setCurrentUrl]);

    const handleChange = (event) => {
        setIdp(event.target.value);

    };

    return (
        <Box sx={{ p: "2rem 0" }}>
            <Box>
                <TextField
                    id="idp"
                    label="Identity Provider"
                    variant="outlined"
                    value={idp}
                    defaultValue={idp}
                    onChange={handleChange}
                    sx={{ width: "50ch" }}
                />
                <Select value={idp} onChange={handleChange} sx={{ width: "25ch" }}>
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="http://localhost:3001">localhost:3001</MenuItem>
                    <MenuItem value="https://solidcommunity.net">Solid Community</MenuItem>
                    <MenuItem value="https://broker.pod.inrupt.com">Inrupt</MenuItem>
                </Select>
            </Box>
            <Box sx={{ p: "2rem 0" }}>
                <LoginButton
                    authOptions={{ clientName: siteTitle }}
                    oidcIssuer={idp}
                    redirectUrl={currentUrl}
                    onError={console.error}
                >
                    <Button variant="contained">Log In</Button>
                </LoginButton>
            </Box>
        </Box>

    );
}