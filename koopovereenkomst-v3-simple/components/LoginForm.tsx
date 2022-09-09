import {
    LoginButton
} from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { siteTitle } from "./layout";

export default function LoginForm() {

    const [idp, setIdp] = useState("https://solidcommunity.net");
    const [currentUrl, setCurrentUrl] = useState("https://localhost:3000");

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, [setCurrentUrl]);


    return (
        <div>
            <input
                id="idp"
                placeholder="Identity Provider"
                defaultValue={idp}
                onChange={(e) => setIdp(e.target.value)}
            />
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