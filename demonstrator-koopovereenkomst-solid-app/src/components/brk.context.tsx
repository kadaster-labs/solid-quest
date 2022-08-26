export const prefix = {
    gebouw: 'https://data.kkg.kadaster.nl/id/gebouw/',
    perceel: 'https://data.kkg.kadaster.nl/id/perceel/',
    nen3610: 'https://data.kkg.kadaster.nl/nen3610/model/def/',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    sor: 'https://data.kkg.kadaster.nl/sor/model/def/',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
}

export const brkContext = {
    '@context': {
        ...prefix,
        afkorting: {
            '@id': 'skos:altLabel',
            '@language': 'nl',
        },
        basisregistratie: {
            '@id': 'rdfs:isDefinedBy',
            '@type': '@id',
        },
        beginGeldigheid: {
            '@id': 'nen3610:beginGeldigheid',
            '@type': 'xsd:date',
        },
        bevatVerblijfsobject: {
            '@reverse': 'sor:maaktDeelUitVan',
        },
        geregistreerdMet: {
            '@id': 'sor:geregistreerdMet',
            '@type': '@id',
        },
        identificatie: {
            '@id': 'nen3610:identificatie',
            '@type': 'xsd:string',
        },
        naam: {
            '@id': 'skos:prefLabel',
            '@language': 'nl',
        },
        oorspronkelijkBouwjaar: {
            '@id': 'sor:oorspronkelijkBouwjaar',
            '@type': 'xsd:gYear',
        },
        perceelnummer: {
            '@id': 'sor:perceelnummer',
            '@type': 'xsd:integer',
        },
        oppervlakte: {
            '@id': 'sor:oppervlakte',
            '@type': 'xsd:postiveInteger',
        },
        status: {
            '@id': 'sor:status',
            '@type': '@id',
        },
    },
}
