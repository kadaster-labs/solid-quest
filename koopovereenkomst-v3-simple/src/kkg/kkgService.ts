// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";
import { Perceel } from "./Perceel";

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

export async function callKadasterKnowledgeGraph(kadastraalObjectId: string): Promise<Perceel> {
    if (kadastraalObjectId === undefined) {
        throw new Error(`Kadaster Knowledge Graph kan niet zonder [kadastraalObjecId] aangeroepen worden (ontvangen: ${kadastraalObjectId})`);
    }
    const queryEngine = new ComunicaEngine('https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql');
    const path = new PathFactory({ context, queryEngine });

    // safety check string conversion
    let koid = typeof kadastraalObjectId == 'string' ? kadastraalObjectId : String(kadastraalObjectId);

    // safety check kadasterObjectId vs IRI 
    let n = koid.startsWith(prefix.perceel) ? kadastraalObjectId : `${prefix.perceel}${kadastraalObjectId}`;

    const perceel = path.create({
        subject: namedNode(n),
    });

    console.log("looking up @ KKG - perceel:", kadastraalObjectId);
    let result = {
        kadastraalObjectId: kadastraalObjectId,
        perceelNummer: await perceel.perceelnummer.value
    }
    console.log('kkgService returned: ', result);
    return result;
}