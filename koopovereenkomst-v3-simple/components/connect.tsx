import { LogoutButton, useSession } from "@inrupt/solid-ui-react";
import LoginForm from '../components/LoginForm';
import styles from '../styles/connect.module.css';

export default function ConnectSolid() {

    const { session, sessionRequestInProgress } = useSession();
    const webId = session.info.webId;

    return (
        <div className={styles.connectBox}>
            <h2>Connect to Solid POD</h2>
            {!sessionRequestInProgress && session.info.isLoggedIn && (
                <span>
                    <LogoutButton onError={console.error} onLogout={() => window.location.reload()}></LogoutButton>
                    <a href={webId} target="_blank" rel="noreferrer">Open WebID</a>
                </span>
            )}

            {!sessionRequestInProgress && !session.info.isLoggedIn && <LoginForm />}
        </div>

    );
}