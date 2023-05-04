export const GENERAL_CONTEXT = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  prov: "https://www.w3.org/TR/prov-o/#",
};

export const SOLID_ZVG_CONTEXT = {
  ...GENERAL_CONTEXT,
  cloudevents: "https://cloudevents.io/def/",

  zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",

  type: "rdf:type",
  label: "rdfs:label",
  wasGeneratedBy: "prov:wasGeneratedBy",
  sequence: "cloudevents:sequence",
  eventData: "cloudevents:data",
  time: "cloudevents:time",

  aggregateIdentifier: "zvg:aggregateIdentifier",
  aan: "zvg:aan",
  aangebodenDoor: "zvg:aangebodenDoor",
  koopprijs: "zvg:koopprijs",
  datumVanLevering: "zvg:datumVanLevering",
  bod: "zvg:bod",
  template: "zvg:koopovereenkomstTemplate",
  kadastraalObjectId: "zvg:kadastraalObjectId",
  verkoper: "zvg:verkoper",
  koper: "zvg:koper",
  eigendom: "zvg:eigendom",
  getekend: "zvg:getekend",
};

export const KADASTER_KKG_CONTEXT = {
  "@context": {
    sor: "https://data.kkg.kadaster.nl/sor/model/def/",
    perceel: "https://data.kkg.kadaster.nl/id/perceel/",
    perceelnummer: {
      "@id": "sor:perceelnummer",
      "@type": "xsd:integer",
    },
  },
};
