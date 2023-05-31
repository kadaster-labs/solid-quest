import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import Head from "next/head";
import Layout, { siteTitle } from "../src/Layout";
import Link from "../src/Link";

export default function Home() {

  const minimalWidth = useMediaQuery('(max-width: 600px)');

  const cardStyle = {
    flex: 1,
    margin: "1rem",
    padding: "1.5rem",
    textAlign: "left",
    color: "inherit",
    textDecoration: "none",
    border: "1px solid #eaeaea",
    borderRadius: "10px",
    transition: "color 0.15s ease, border-color 0.15s ease",
    maxWidth: "300px",
    '&:hover': {
      backgroundColor: "rgb(30, 101, 146, 0.5)",
    },
    '&:focus': {
      backgroundColor: "rgb(30, 101, 146, 0.5)",
    },
    '&:active': {
      backgroundColor: "rgb(30, 101, 146, 0.5)",
    },
    h2: {
      margin: "0 0 1rem 0",
      fontSize: "1.5rem",
    },
    p: {
      margin: 0,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    }

  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Box sx={{
        fontSize: "1.2rem",
        lineHeight: "1.5",
      }}>
        <Typography variant="h1" sx={{
          lineHeight: 1.15,
          fontSize: "4rem",
          textAlign: "center",
        }}>
          Welkom bij de Koopovereenkomst Solid App!
        </Typography>

        <Typography sx={{
          textAlign: "center",
          margin: "4rem 0",
          lineHeight: 1.5,
          fontSize: "1.5rem",
        }}>
          Start pagina van de Koopovereenkomst Solid App! Vanaf deze pagina kan
          genavigeerd worden naar de verschillende &apos;ingangen&apos; voor de
          betreffende rollen.
        </Typography>

        <Container sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: "800px",
          a: {
            margin: "1rem",
          },
          ...(minimalWidth && {
            width: "100%",
            flexDirection: "column",
          })
        }}>
          <Link href="/verkoper" sx={cardStyle}>
            <h2>Verkoper &rarr;</h2>
            <p><em>Ik wil een woning verkopen</em></p>
          </Link>

          <Link href="/koper" sx={cardStyle}>
            <h2>Koper &rarr;</h2>
            <p><em>Ik wil een woning kopen</em></p>
          </Link>
        </Container>
      </Box>
    </Layout>
  );
}
