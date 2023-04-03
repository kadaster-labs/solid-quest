import * as $rdf from 'rdflib';

import { Event } from './aggregate/koopovereenkomst-aggregate';
import { VLB } from './verkooplogboek';
import { getWebId } from './Solid';

export function VLB2RDF(vlb: VLB, options): string {
  const store = $rdf.graph();

  const ns = {
    koopovereenkomst: $rdf.namedNode(`${options.vlbContainer}/${vlb.activeKoek}`),
    event: $rdf.namedNode(options.eventContainer),
    koperEvent: $rdf.namedNode(`http://localhost:3001/koper-koos/koopovereenkomst/events/id/`),
    prov: $rdf.Namespace('https://www.w3.org/TR/prov-o/#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  };

  const eventList = vlb.events.map(event => event);

  for (const event of eventList) {
    store.add(ns.koopovereenkomst, ns.prov('wasGeneratedBy'), $rdf.sym(event), ns.koopovereenkomst);
  }

  const serializer = new $rdf.Serializer(store);
  const string = serializer.toN3(store);
  console.log("vlb string", string);

  return string;
}

export function createRDFEvent(eventData: Event, options): string {
  // TODO: Can now only create events for Vera. Not yet for Koos.
  const store = $rdf.graph();

  const ns = {
    event: $rdf.namedNode(`${options.eventContainer}/${eventData.id}`),
    rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    xsd: $rdf.Namespace('http://www.w3.org/2001/XMLSchema#'),
    zvg: $rdf.Namespace('http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'),
    cloudevents: $rdf.Namespace('https://cloudevents.io/def/'),
    koopovereenkomst: $rdf.namedNode(options.vlbContainer),
    me: $rdf.namedNode(getWebId()),
  };

  const eventNode = ns.event;
  const dataNode = $rdf.namedNode(ns.event.uri + '#data');

  const labelNode = $rdf.literal(
    `${eventData.seq} | ${eventData.actor} | ${eventData.type} voor ${eventData.aggregateId}`
  );
  const timeNode = $rdf.literal(eventData.time, ns.xsd('dateTime'));
  const sequenceNode = $rdf.literal(eventData.seq, ns.xsd('integer'));

  store.add(eventNode, ns.rdf('type'), ns.zvg(eventData.type), eventNode);
  store.add(eventNode, ns.zvg('aggregateIdentifier'), eventData.aggregateId, eventNode);
  store.add(eventNode, ns.cloudevents('sequence'), sequenceNode, eventNode);
  store.add(eventNode, ns.cloudevents('specversion'), $rdf.literal('1.0'), eventNode);
  store.add(eventNode, ns.cloudevents('subject'), eventData.aggregateId, eventNode);
  store.add(eventNode, ns.cloudevents('time'), timeNode, eventNode);
  store.add(eventNode, ns.cloudevents('source'), ns.me, eventNode);
  store.add(eventNode, ns.rdfs('label'), labelNode, eventNode);
  store.add(eventNode, ns.cloudevents('data'), dataNode, eventNode);
  store.add(dataNode, ns.rdf('type'), ns.zvg('eventData'), dataNode);
  store.add(dataNode, ns.zvg('koopovereenkomstTemplate'), $rdf.literal('NVM Simple Default Koophuis'), dataNode);

  const turtleString = $rdf.serialize(null, store, eventNode.doc().uri, 'text/turtle');

  return turtleString;
}