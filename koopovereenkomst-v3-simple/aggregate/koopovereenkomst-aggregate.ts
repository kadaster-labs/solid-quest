import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";
import { KADASTER_KKG_CONTEXT } from "./context";

interface Event {
  aggregateId: string;
  id: string;
  seq: number;
  type: string;
  actor: string;
  label: string;
  newLabel?: string;
  time: string;
  template?: string;
  kadastraalObjectId?: string;
  koopprijs?: number;
}

interface Perceel {
  kadastraalObjectId: string;
  perceelNummer: string;
}

export default class KoopovereenkomstAggregate {
  private data: any = {};
  private events: Event[] = [];

  private queryEngine = new ComunicaEngine(
    "https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql"
  );
  private path = new PathFactory({
    context: KADASTER_KKG_CONTEXT,
    queryEngine: this.queryEngine,
  });

  constructor(ko: solidQuery, pod: solidQuery) {
    this.data = {
      ...this.data,
      iri: ko.value,
      id: ko.value.split("/").pop(),
    };
  }

  public getEvents(): Event[] {
    return this.events.sort((a, b) => a.seq - b.seq);
  }

  public dump(): object {
    return this.data;
    // return {
    //   koopovereenkomstId: this.id,
    //   iri: this.iri,
    //   typeKoopovereenkomst: this.typeKoopovereenkomst,
    //   kadastraalObject: this.kadastraalObject,
    //   koopprijs: this.koopprijs,
    // };
  }

  public async handleEvent(eventUri: solidQuery) {
    // console.log(`  - ${eventUri}`);
    let thePod: string;
    try {
      thePod = eventUri.value.split("3001")[1].split("/")[1];
      // console.log(`  - the pod: ${thePod}`);
    } catch (error) {
      console.log("error extracting POD path", error);
    }

    const event = solidQuery[`${eventUri}`];
    let theType: string;
    for await (const t of event.type) {
      if (t.value.includes("taxonomie.zorgeloosvastgoed.nl")) {
        theType = t.value.split("#")[1];
      }
    }
    const curLabel = await event.label.value;
    const e = {
      aggregateId: this.data.id,
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
        newLabel: `${e.seq.padStart(2, "0")} | ${e.time} | ${
          e.actor
        } | ${beautifyCamelCase(e.type)} for ${e.aggregateId}`,
      });
    } catch (error) {
      console.warn("building up label went wrong (somehow)", error);
    }

    if (theType === "koopovereenkomstGeinitieerd") {
      this.processKoopovereenkomstGeinitieerd(e, event);
    } else if (theType === "kadastraalObjectIdToegevoegd") {
      this.processKadastraalObjectIdToegevoegd(e, event);
    } else if (theType === "koopprijsToegevoegd") {
      this.processKoopprijsToegevoegd(e, event);
    } else if (
      theType === "conceptKoopovereenkomstVerkoperOpgeslagen" ||
      theType === "getekendeKoopovereenkomstKoperOpgeslagen" ||
      theType === "datumVanLeveringToegevoegd" ||
      theType === "persoonsgegevensRefToegevoegd" ||
      theType === "conceptKoopovereenkomstKoperOpgeslagen" ||
      theType ===
        "getekendeKoopovereenkomstKoperTerInschrijvingAangebodenBijKadaster" ||
      theType === "getekendeKoopovereenkomstVerkoperOpgeslagen" ||
      theType === "conceptKoopovereenkomstGetekend"
    ) {
      console.log(`extract data from [${theType}] event`);
    } else {
      console.warn(`unsupported event in handler: [${theType}]`);
    }

    this.events.push(e);
  }

  private async processKoopprijsToegevoegd(e: Event, event: solidQuery) {
    Object.assign(e, { koopprijs: await event.eventData.koopprijs.value });

    this.data = { ...this.data, koopprijs: e.koopprijs };
  }

  private async processKadastraalObjectIdToegevoegd(
    e: Event,
    event: solidQuery
  ) {
    Object.assign(e, {
      kadastraalObjectId: await event.eventData.kadastraalObjectId.value,
    });

    console.log("looking up @ KKG - perceel:", e.kadastraalObjectId);
    const perceel = this.path.create({
      subject: namedNode(`${e.kadastraalObjectId}`),
    });

    this.data = {
      ...this.data,
      kadastraalObject: {
        kadastraalObjectId: e.kadastraalObjectId,
        perceelNummer: await perceel.perceelnummer.value,
      },
    };
  }

  private async processKoopovereenkomstGeinitieerd(
    e: Event,
    event: solidQuery
  ) {
    Object.assign(e, { template: await event.eventData.template.value });

    if (e.template === "NVM Simple Default Koophuis") {
      this.data = { ...this.data, typeKoopovereenkomst: "Koop" };
    } else {
      throw new Error(
        `Unsupported template [${e.template}] in processing events`
      );
    }
  }
}

function beautifyCamelCase(s: string): string {
  return (
    s
      // insert a space before all caps
      .replace(/([A-Z])/g, " $1")
      // uppercase the first character
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
  );
}
