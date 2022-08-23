import * as React from "react"

const headingStyles = {
    marginTop: 0,
    marginBottom: 64,
    "text-align": "center",
}

const headingAccentStyles = {
    color: "#663399",
}

export const Header = ({ title, links }: { title: string, links?: [] }) => {
    return (
        <h1 style={headingStyles}>
            Koopovereenkomst Solid App
            <br />
            <span style={headingAccentStyles}>Demonstrator</span>
        </h1>
    )
}