// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";
import { useState } from "react";
import { Box, Button } from "@mui/material";

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

const KadasterKnowledgeGraph = function (objectId) {
    const [perceelnummer, setPerceelnummer] = useState("");

    let [kadastraalObjectId, setKadastraalObjectId] = useState(objectId.objectId);

    const handleChange = (e) => {
        setKadastraalObjectId(e.target.value);
    };

    const queryEngine = new ComunicaEngine('https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql');
    const path = new PathFactory({ context, queryEngine });
    const perceel = path.create({
        subject: namedNode(`${prefix.perceel}${kadastraalObjectId}`),
    });

    const callKadaster = async () => {
        console.log(`just before calling ... [${prefix.perceel}${kadastraalObjectId}]`);
        console.log(`perceelnummer: ${await perceel.perceelnummer}`);
        setPerceelnummer(await perceel.perceelnummer.value);
    }

    return (
        <Box sx={{
            width: "100%",
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
         }}>
            <input type="text" value={kadastraalObjectId} onChange={handleChange}></input>
            <Button variant="contained" color="warning" onClick={callKadaster}>call KKG</Button>
            <p>Perceelnummer: {perceelnummer}</p>
        </Box>
    );
}

export default KadasterKnowledgeGraph;
