import {
    LoginButton
} from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { siteTitle } from "./Layout";

export default function LoginForm() {

    const [idp, setIdp] = useState("");
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
        <div>
            <input
                id="idp"
                placeholder="Identity Provider"
                defaultValue={idp}
                onChange={(e) => setIdp(e.target.value)}
            />
            <select value={idp} onChange={handleChange}>
                <option value="">None</option>
                <option value="https://solidcommunity.net">Solid Community</option>
                <option value="https://broker.pod.inrupt.com">Inrupt</option>
                <option value="http://localhost:8443">localhost:3001</option>
            </select>
            <LoginButton
                authOptions={{ clientName: siteTitle }}
                oidcIssuer={idp}
                redirectUrl={currentUrl}
                onError={console.error}
            >
                <button>Log In</button>
            </LoginButton>
        </div>

    );
}