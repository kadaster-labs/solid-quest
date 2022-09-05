import { Link } from "gatsby"
import * as React from "react"

const footer = {
    marginTop: "2em",
    display: "flex",
    justifyContent: "center",
}

const itemStyle = {
    // margin: "auto",
    display: "block",
    minHeight: 24,
    align: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: "auto",
    marginBottom: "auto",
}


export const Footer = () => {
    return (
        <div id="footer" style={footer}>
            <a style={itemStyle} href="https://kadaster.nl">
                <img
                    alt="Kadaster Logo"
                    src="data:image/svg+xml,%3Csvg%20height%3D%222500%22%20viewBox%3D%22-.02%20.26%20458.79%20599.74%22%20width%3D%221913%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m124.78%20369.94%20107.36-369.68h-83.79l-148.37%20508.54z%22%20fill%3D%22%2300889e%22%2F%3E%3Cpath%20d%3D%22m249.86%20232.42-56.42%2062.43%20167.49%20305.15h97.84z%22%20fill%3D%22%2300387d%22%2F%3E%3C%2Fsvg%3E"
                    width={24}
                />
            </a>
            <Link style={itemStyle} to="/">Home</Link>
            <a style={itemStyle} href="https://github.com/marcvanandel/solid-quest">GitHub</a>
        </div>
    )
}