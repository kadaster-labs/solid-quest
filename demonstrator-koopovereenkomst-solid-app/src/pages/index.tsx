import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

const listStyles = {
  maxWidth: "none",
  lineHeight: "var(--line-height-loose)",
}

const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  display: `inline-block`,
  marginBottom: 24,
  marginRight: 12,
}

const tiles = {
  display: "flex",
  "justify-content": "space-between"
}

const tile = {}

const dashboardLink = { text: "Dashboard", url: "login", color: "#000", }

const roles = [
  {
    text: "Makelaar Mike", img: "../images/makelaar-mike.png", links: [
      dashboardLink,
      { text: "Nieuwe koopovereenkomst", url: "initiate", color: "#0D96F2", },
      { text: "Koppel POD", url: "connect-pod", color: "#0D96F2", },
    ]
  },
  {
    text: "Verkoper Vera", img: "../images/verkoper-vera.png", links: [
      dashboardLink,
      { text: "Koppel POD", url: "connect-pod", color: "#BC027F", },
    ]
  },
  {
    text: "Koper Koos", img: "../images/koper-koos.png", links: [
      dashboardLink,
      { text: "Koppel POD", url: "connect-pod", color: "#8EB814", },
    ]
  },
]

const imageTag = (text: string) => {
  if (text.startsWith("Makelaar")) {
    return <StaticImage src="../images/makelaar-mike.png" alt="Makelaar Mike" width={350} />
  }
  else if (text.startsWith("Verkoper")) {
    return <StaticImage src="../images/verkoper-vera.png" alt="Verkoper Vera" width={350} />
  }
  else if (text.startsWith("Koper")) {
    return <StaticImage src="../images/koper-koos.png" alt="Koper Koos" width={350} />
  }
  else {
    return <p>no image available</p>
  }
}

const IndexPage = () => {
  return (
    <Layout>

      <Header title="Landing Page"></Header>

      <div style={tiles}>
        {roles.map(role => (
          <div style={tile}>
            {imageTag(role.text)}
            <h2>{role.text}</h2>
            <p style={listStyles}>
              {role.links.map((link, i) => (
                <React.Fragment key={link.url}>
                  <Link to={link.url}>{link.text}</Link>
                  {i !== role.links.length - 1 && <> · </>}
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>

      <Footer />
    </Layout>
  )
}

export default IndexPage

export const Head = () => (
  <SEO title="Landing Page" />
)
