import {
    LoginButton
} from "@inrupt/solid-ui-react";
import { useEffect, useRef, useState } from "react";
import { siteTitle } from "./layout";

export default function LoginForm() {

    const [idp, setIdp] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");

    const loginButton = useRef(null);

    useEffect(() => {
        setCurrentUrl(window.location.href);
        console.debug("updated currentUrl");
    }, [setCurrentUrl]);

    useEffect(() => {
        console.log(`idp set to: ${idp}`);
    }, [idp]);

    const setIdpAndTriggerLogin = (url: string) => {
        setIdp(url);
        // console.log(`idp set to: ${idp}`);
        // loginButton.current.click();
    }

    const idpIsSolidCommunity = function (e) {
        setIdpAndTriggerLogin("https://solidcommunity.net");
    }

    const idpIsInrupt = function (e) {
        setIdpAndTriggerLogin("https://broker.pod.inrupt.com");
    }

    const idpIsLocalhost3001 = function (e) {
        setIdpAndTriggerLogin("http://localhost:3001");
    }

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
                <button ref={loginButton}>Log In</button>
            </LoginButton>
            <button onClick={idpIsSolidCommunity}>Solid Community</button>
            <button onClick={idpIsInrupt}>Inrupt</button>
            <button onClick={idpIsLocalhost3001}>Localhost:3001</button>
        </div>

    );
}