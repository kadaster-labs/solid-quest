import * as $rdf from 'rdflib';

import { Event } from "./koek/Event";
import { getWebId } from './Solid';

export function aggregate2RDF(id: string, events: Event[], options): string {
  if (events.length === 0) {
    return '';
  }

  const store = $rdf.graph();

  const idUri = id.startsWith("http") ? id : `${options.vlbContainer}/${id}`;

  const ns = {
    koopovereenkomst: $rdf.namedNode(idUri),
    event: $rdf.namedNode(options.eventContainer),
    koperEvent: $rdf.namedNode(`http://localhost:3001/koper-koos/koopovereenkomst/events/id/`),
    prov: $rdf.Namespace('https://www.w3.org/TR/prov-o/#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  };

  const eventList = events.map(event => {
    return `${event.id}`
  });

  for (const event of eventList) {
    store.add(ns.koopovereenkomst, ns.prov('wasGeneratedBy'), $rdf.sym(event), ns.koopovereenkomst);
  }

  const serializer = new $rdf.Serializer(store);
  const string = serializer.toN3(store);

  return string;
}

export function event2RDF(eventData: Event, options): string {
  const store = $rdf.graph();

  const ns = {
    event: $rdf.namedNode(`${options.eventContainer}/${eventData.id}`),
    rdfs: $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#'),
    rdf: $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
    xsd: $rdf.Namespace('http://www.w3.org/2001/XMLSchema#'),
    zvg: $rdf.Namespace('http://taxonomie.zorgeloosvastgoed.nl/def/zvg#'),
    cloudevents: $rdf.Namespace('https://cloudevents.io/def/'),
    me: $rdf.namedNode(getWebId()),
  };

  const eventNode = ns.event;

  const labelNode = $rdf.literal(
    `${eventData.seq.toString().padStart(2, "0")} | ${eventData.actor} | ${eventData.type} voor ${eventData.aggregateId}`
  );
  const timeNode = $rdf.literal(eventData.time, ns.xsd('dateTime'));
  const sequenceNode = $rdf.literal(eventData.seq, ns.xsd('integer'));
  const aggregateId = $rdf.namedNode(`${options.vlbContainer}/${eventData.aggregateId}`);

  store.add(eventNode, ns.rdf('type'), ns.zvg(eventData.type), eventNode);
  store.add(eventNode, ns.zvg('aggregateIdentifier'), aggregateId, eventNode);
  store.add(eventNode, ns.cloudevents('sequence'), sequenceNode, eventNode);
  store.add(eventNode, ns.cloudevents('specversion'), $rdf.literal('1.0'), eventNode);
  store.add(eventNode, ns.cloudevents('subject'), aggregateId, eventNode);
  store.add(eventNode, ns.cloudevents('time'), timeNode, eventNode);
  store.add(eventNode, ns.cloudevents('source'), ns.me, eventNode);
  store.add(eventNode, ns.rdfs('label'), labelNode, eventNode);

  if (eventData.template
    || eventData.kadastraalObjectId
    || eventData.koopprijs
    || eventData.datumVanLevering
    || eventData.verkoperRefs
    || eventData.eigendomRefs
    || eventData.koperRefs) {
    const dataNode = $rdf.namedNode(ns.event.uri + '#data');

    store.add(eventNode, ns.cloudevents('data'), dataNode, eventNode);
    store.add(dataNode, ns.rdf('type'), ns.zvg('eventData'), dataNode);

    if (eventData.template) {
      store.add(dataNode, ns.zvg('koopovereenkomstTemplate'), $rdf.literal(eventData.template), dataNode);
    }
    if (eventData.kadastraalObjectId) {
      store.add(dataNode, ns.zvg('kadastraalObjectId'), $rdf.namedNode(`https://data.kkg.kadaster.nl/id/perceel/${eventData.kadastraalObjectId}`), dataNode);
    }
    if (eventData.koopprijs) {
      store.add(dataNode, ns.zvg('koopprijs'), $rdf.literal(eventData.koopprijs, ns.xsd('integer')), dataNode);
    }
    if (eventData.datumVanLevering) {
      store.add(dataNode, ns.zvg('datumVanLevering'), $rdf.literal(eventData.datumVanLevering, ns.xsd('date')), dataNode);
    }
    if (eventData.verkoperRefs) {
      eventData.verkoperRefs.forEach(ref => {
        store.add(dataNode, ns.zvg('verkoper'), $rdf.namedNode(ref), dataNode);
      });
    }
    if (eventData.koperRefs) {
      eventData.koperRefs.forEach(ref => {
        console.log('adding named node for koper', ref);
        store.add(dataNode, ns.zvg('koper'), $rdf.namedNode(ref), dataNode);
      });
    }
    if (eventData.eigendomRefs) {
      eventData.eigendomRefs.forEach(ref => {
        store.add(dataNode, ns.zvg('eigendom'), $rdf.namedNode(ref), dataNode);
      });
    }
  }

  const turtleString = $rdf.serialize(null, store, eventNode.doc().uri, 'text/turtle');

  return turtleString;
}