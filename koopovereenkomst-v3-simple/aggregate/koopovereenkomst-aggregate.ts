import { default as data } from "@solid/query-ldflex/lib/exports/rdflib";

interface Event {
  aggregateId: string;
  id: string;
  seq: number;
  type: string;
  actor: string;
  label: string;
  newLabel?: string;
  time: string;
}

export default class KoopovereenkomstAggregate {
  private id: string;
  private iri: string;
  private events: Event[] = [];

  constructor(ko: data, pod: data) {
    this.iri = ko.value;
    this.id = ko.value.split("/").pop();
  }

  public getLabels(): any[] {
    return this.getEvents().map((e) => e.newLabel);
  }

  public getEvents(): Event[] {
    return this.events.sort((a, b) => a.seq - b.seq);
  }

  public async handleEvent(eventUri: data) {
    // console.log(`  - ${eventUri}`);
    let thePod: string;
    try {
      thePod = eventUri.value.split("3001")[1].split("/")[1];
      // console.log(`  - the pod: ${thePod}`);
    } catch (error) {
      console.log("error extracting POD path", error);
    }

    const event = data[`${eventUri}`];
    let theType: string;
    for await (const t of event.type) {
      if (t.value.includes("taxonomie.zorgeloosvastgoed.nl")) {
        theType = t.value.split("#")[1];
      }
    }
    const curLabel = await event.label.value;
    const e = {
      aggregateId: this.id,
      id: eventUri.value,
      seq: await event.sequence.value,
      type: theType,
      actor: thePod,
      label: curLabel,
      time: await event.time.value,
    };

    // add build up label
    try {
      Object.assign(e, {
        newLabel: `${e.seq.padStart(2, "0")} | ${e.time} | ${e.actor} | ${e.type} for ${
          e.aggregateId
        }`,
      });
    } catch (error) {
      console.warn("building up label went wrong (somehow)", error);
    }

    if (theType === "bodUitgebracht") {
      Object.assign(e, { bod: await event.eventData.bod.value });
    } else if (theType === "koopovereenkomstGeinitieerd") {
      Object.assign(e, { template: await event.eventData.template.value });
    } else if (theType === "conceptKoopovereenkomstVerkoperOpgeslagen") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "kadastraalObjectIdToegevoegd") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "getekendeKoopovereenkomstKoperOpgeslagen") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "datumVanLeveringToegevoegd") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "persoonsgegevensRefToegevoegd") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "conceptKoopovereenkomstKoperOpgeslagen") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "koopprijsToegevoegd") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "getekendeKoopovereenkomstKoperTerInschrijvingAangebodenBijKadaster") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "getekendeKoopovereenkomstVerkoperOpgeslagen") {
      console.log(`extract data from [${theType}] event`);
    } else if (theType === "conceptKoopovereenkomstGetekend") {
      console.log(`extract data from [${theType}] event`);
    } else {
      console.warn(`unsupported event in handler: [${theType}]`);
    }

    this.events.push(e);
  }
}
