import * as $rdf from 'rdflib';

import { Event } from './aggregate/koopovereenkomst-aggregate';
import { VLB } from './verkooplogboek';

export function VLB2RDF(vlb: VLB): string {
  const store = $rdf.graph();

  const ns = {
    koopovereenkomst: $rdf.namedNode(`http://localhost:3001/verkoper-vera/koopovereenkomst/id/${vlb.activeKoek}`),
    event: $rdf.namedNode(`http://localhost:3001/verkoper-vera/koopovereenkomst/events/id/`),
    koperEvent: $rdf.namedNode(`http://localhost:3001/koper-koos/koopovereenkomst/events/id/`),
    prov: $rdf.Namespace('https://www.w3.org/TR/prov-o/#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  };
  
  console.log("vlb.events", vlb.events);

  const collection = new $rdf.Collection();
  for (const event of vlb.events) {
    collection.append($rdf.sym(event));
  }
  
  console.log("events", collection);
  
  // Create a linked list of events
  // const list = events.reduceRight((rest, node) => {
  //   const listNode = $rdf.blankNode();
  //   store.add(listNode, ns.rdf('first'), node);
  //   store.add(listNode, ns.rdf('rest'), rest);
  //   return listNode;
  // }, $rdf.nil);

  store.add(ns.koopovereenkomst, ns.prov('wasGeneratedBy'), collection, ns.koopovereenkomst);

  const serializer = new $rdf.Serializer(store);
  const string = serializer.toN3(store);
  console.log("string", string);

  return string;
}

export function createRDFEvent(eventData: Event): string {
  // TODO: Can now only create events for Vera. Not yet for Koos.
  const store = $rdf.graph();

  const ns = {
    event: $rdf.namedNode(`http://localhost:3001/verkoper-vera/koopovereenkomst/events/id/${eventData.id}`),
    rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    xsd: $rdf.Namespace('http://www.w3.org/2001/XMLSchema#'),
    zvg: $rdf.Namespace('http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'),
    cloudevents: $rdf.Namespace('https://cloudevents.io/def/'),
    koopovereenkomst: $rdf.namedNode('http://localhost:3001/verkoper-vera/koopovereenkomst/id/'),
    me: $rdf.namedNode('http://localhost:3001/verkoper-vera/profile/card#me'),
  };

  const eventNode = ns.event;
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

  const turtleString = $rdf.serialize(eventNode.doc(), store, eventNode.doc().uri, 'text/turtle');

  return turtleString;
}