import * as React from "react"
import "./layout.css"

const pageStyle = {
    color: "#232129",
    padding: 96,
    fontFamily: "-apple-system, Roboto, sans-serif, serif",
    "text-align": "center",
}

export const Layout = ({ children }: { children: any }) => {
    return (
        <main style={pageStyle}>
            {children}
        </main>
    )
}