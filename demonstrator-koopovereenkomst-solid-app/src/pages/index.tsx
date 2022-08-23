import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { Header } from "../components/header"
import { SEO } from "../components/seo"

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  "text-align": "center",
}

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

const footer = {
  marginTop: "2em",
}

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
    <main style={pageStyles}>

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
      <div id="footer" style={footer}>
        <img
          alt="Kadaster Logo"
          src="data:image/svg+xml,%3Csvg%20height%3D%222500%22%20viewBox%3D%22-.02%20.26%20458.79%20599.74%22%20width%3D%221913%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m124.78%20369.94%20107.36-369.68h-83.79l-148.37%20508.54z%22%20fill%3D%22%2300889e%22%2F%3E%3Cpath%20d%3D%22m249.86%20232.42-56.42%2062.43%20167.49%20305.15h97.84z%22%20fill%3D%22%2300387d%22%2F%3E%3C%2Fsvg%3E"
          width={24}
        />
      </div>
    </main>
  )
}

export default IndexPage

export const Head = () => (
  <SEO title="Landing Page" />
)
