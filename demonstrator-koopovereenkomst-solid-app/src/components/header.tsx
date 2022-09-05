import * as React from "react"

const headerStyle = {
    marginBottom: 64,
}

const headingStyles = {
    marginTop: 0,
    textAlign: "center",
}

const headingAccentStyles = {
    color: "#663399",
}

export const Header = ({ title, links }: { title: string, links?: [] }) => {
    return (
        <div id="header" style={headerStyle}>
            <h1 style={headingStyles}>
                Koopovereenkomst Solid App
                <br />
                <span style={headingAccentStyles}>Demonstrator</span>
            </h1>
            <h2>{title}</h2>
        </div>
    )
}