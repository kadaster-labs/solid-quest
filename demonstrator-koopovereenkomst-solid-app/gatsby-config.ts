import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Demonstrator Koopovereenkomst Solid App`,
    description: `Een demonstrator om de werking van Solid PODs te laten zien met als casus de Koopovereenkomst van Zorgeloos Vastgoed.`,
    siteUrl: `https://github.com/marcvanandel/solid-quest/tree/main/demonstrator-koopovereenkomst-solid-app`,
  },
  pathPrefix: "solid-quest",
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};

export default config;
