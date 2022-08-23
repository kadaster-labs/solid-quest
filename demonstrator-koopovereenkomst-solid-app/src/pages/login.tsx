import * as React from "react"
import { Header } from "../components/header"
import { SEO } from "../components/seo"

const LoginPage = () => {
    return (
        <main>
            <Header title="Log in"></Header>
            <p>Logging in ... with IRMA</p>
        </main>
    )
}

export default LoginPage

export const Head = () => (
    <SEO title="Log in" />
)
