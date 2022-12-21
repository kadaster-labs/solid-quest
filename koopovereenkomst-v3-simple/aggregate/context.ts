export const CONTEXT = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  prov: "https://www.w3.org/TR/prov-o/#",
  zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
  cloudevents: "https://cloudevents.io/def/",

  type: "rdf:type",
  label: "rdfs:label",
  wasGeneratedBy: "prov:wasGeneratedBy",
  sequence: "cloudevents:sequence",
  eventData: "cloudevents:data",
  time: "cloudevents:time",

  aan: "zvg:aan",
  aangebodenDoor: "zvg:aangebodenDoor",
  koopsom: "zvg:koopsom",
  bod: "zvg:bod",
  template: "zvg:koopovereenkomstTemplate",
};
