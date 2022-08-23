import * as React from "react"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

const LoginPage = () => {
    return (
        <Layout>
            <Header title="Log in"></Header>
            <p>Logging in ... with IRMA</p>
            <Footer />
        </Layout>
    )
}

export default LoginPage

export const Head = () => (
    <SEO title="Log in" />
)
