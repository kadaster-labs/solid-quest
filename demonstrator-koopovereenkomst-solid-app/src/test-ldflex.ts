// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";

export function pathFactory(sources: any, options?: any) {
  const queryEngine =
    options?.queryEngine ?? new ComunicaEngine(sources, options);
  const context = options?.context ?? {};
  return new PathFactory({ queryEngine, context });
}

const NAMESPACE = /^[^]*[#/]/;

export function createPathUsingFactory(factory: any) {
  return function createPath(node: any, sources?: any, options?: any) {
    const _options = options ?? {};
    const subject = typeof node === "string" ? namedNode(node) : node;

    const namespace = NAMESPACE.exec(subject.value)?.[0] ?? "";

    // Try and use the original nodes namespace for the vocab if no context is provided
    const context = _options.context ?? { "@context": { "@vocab": namespace } };

    return factory(sources ?? namespace, { ..._options, context }).create({
      subject,
    });
  };
}

export const createPath = createPathUsingFactory(pathFactory);

const prefix = {
  gebouw: "https://data.kkg.kadaster.nl/id/gebouw/",
  perceel: "https://data.kkg.kadaster.nl/id/perceel/",
  nen3610: "https://data.kkg.kadaster.nl/nen3610/model/def/",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  sor: "https://data.kkg.kadaster.nl/sor/model/def/",
  xsd: "http://www.w3.org/2001/XMLSchema#",
};

const context = {
  "@context": {
    ...prefix,
    afkorting: {
      "@id": "skos:altLabel",
      "@language": "nl",
    },
    naam: {
      "@id": "perceel:naam",
      "@type": "xsd:string",
    },
    basisregistratie: {
      "@id": "rdfs:isDefinedBy",
      "@type": "@id",
    },
    beginGeldigheid: {
      "@id": "nen3610:beginGeldigheid",
      "@type": "xsd:date",
    },
    bevatVerblijfsobject: {
      "@reverse": "sor:maaktDeelUitVan",
    },
    domain: {
      "@id": "rdfs:domain",
      // "@type": "@id",
    },
    geregistreerdMet: {
      "@id": "sor:geregistreerdMet",
      "@type": "@id",
    },
    identificatie: {
      "@id": "nen3610:identificatie",
      "@type": "xsd:string",
    },
    oorspronkelijkBouwjaar: {
      "@id": "sor:oorspronkelijkBouwjaar",
      "@type": "xsd:gYear",
    },
    perceelnummer: {
      "@id": "sor:perceelnummer",
      "@type": "xsd:integer",
    },
    oppervlakte: {
      "@id": "sor:oppervlakte",
      "@type": "xsd:postiveInteger",
    },
    status: {
      "@id": "sor:status",
      "@type": "@id",
    },
  },
};

const queryEngine = new ComunicaEngine(
  "https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql"
);
const path = new PathFactory({ context, queryEngine });

async function run() {
  const gebouw = path.create({
    subject: namedNode(`${prefix.gebouw}0200100000085932`),
  });
  await toon_gebouw(gebouw);

  const perceel = path.create({
    subject: namedNode(`${prefix.perceel}10020263270000`),
  });
  await toon_perceel(perceel);

  async function toon_perceel(perceel: any) {
    console.log(`- Perceelnummer: ${await perceel.perceelnummer}`);
    console.log(`- naam: ${await perceel.naam}`);
    console.log(`- status: ${await perceel.status}`);
    console.log(`- domain: ${await perceel.domain}`);
    console.log(`- Bouwjaar: ${await perceel.oorspronkelijkBouwjaar}`);

    if (true) {
      console.log(`${await perceel} attributes are:`);
      for await (const attr of perceel.properties) {
        if (attr.startsWith("sor") || !attr.includes(":")) console.log(`- ${attr}`);
      }
    }
  }

  async function toon_gebouw(gebouw: any) {
    console.log(`- Bouwjaar: ${await gebouw.oorspronkelijkBouwjaar}`);
    console.log(`- Status: ${await gebouw.status}`);
    console.log(`- Registraties:`);
    for await (const registratie of gebouw.geregistreerdMet) {
      await toon_registratie(registratie);
    }
    for await (const verblijfsobject of gebouw.bevatVerblijfsobject) {
      await toon_verblijfsobject(verblijfsobject);
    }
  }

  async function toon_registratie(registratie: any) {
    console.log(
      `\t- Basisregistratie: ${await registratie.basisregistratie
        .naam} (${await registratie.basisregistratie.afkorting}):`
    );
    console.log(`\t\t- Identificatie: ${await registratie.identificatie}`);
    console.log(`\t\t- Begin geldigheid: ${await registratie.beginGeldigheid}`);
  }

  async function toon_verblijfsobject(verblijfsobject: any) {
    console.log(`\t- Verblijfsobject: ${await verblijfsobject.oppervlakte}`);
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
process.on("uncaughtException", function (err) {
  console.error("Uncaught exception", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
