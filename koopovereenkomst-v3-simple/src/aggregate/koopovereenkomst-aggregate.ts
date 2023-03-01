import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
// @ts-ignore
import { PathFactory } from "ldflex";
// @ts-ignore
import ComunicaEngine from "@ldflex/comunica";
// @ts-ignore
import { namedNode } from "@rdfjs/data-model";
import * as jsonld from "jsonld";
import { GENERAL_CONTEXT, KADASTER_KKG_CONTEXT } from "./context";

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
  datumVanLevering?: string;
}

interface Perceel {
  kadastraalObjectId: string;
  perceelNummer: string;
}

export default class KoopovereenkomstAggregate {
  private data: any = {
    "@context": {
      ...GENERAL_CONTEXT,
      zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
    },
  };
  private events: Event[] = [];

  private queryEngine = new ComunicaEngine(
    "https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql"
  );
  private path = new PathFactory({
    context: KADASTER_KKG_CONTEXT,
    queryEngine: this.queryEngine,
  });

  constructor(ko: solidQuery, pod: solidQuery) {
    this.dataAppend(
      {
        iri: "zvg:koopovereenkomst-iri",
        koopovereenkomst: "zvg:koopovereenkomst",
      },
      {
        iri: ko.value,
        koopovereenkomst: {
          "@id": ko.value.split("/").pop(),
        },
      }
    );
  }

  public getEvents(): Event[] {
    return this.events.sort((a, b) => a.seq - b.seq);
  }

  public getData() : any {
    return this.data;
  }

  public async dumpJsonLD(): Promise<object> {
    const p = new Promise<object>((resolve, reject) => {
      resolve(this.data);
    });
    return p;
  }

  public async dumpNQuads(): Promise<string> {
    return await jsonld.toRDF(this.data, { format: "application/n-quads" });
  }

  public async handleEvent(eventUri: solidQuery) {
    let thePod: string;
    try {
      thePod = eventUri.value.split("3001")[1].split("/")[1];
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
      aggregateId: this.data.koopovereenkomst["@id"],
      id: eventUri.value,
      seq: await event.sequence.value,
      type: theType,
      actor: thePod,
      label: curLabel,
      time: await event.time.value,
    };

    // add dynamic label
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
      await this.processKoopovereenkomstGeinitieerd(e, event);
    } else if (theType === "kadastraalObjectIdToegevoegd") {
      await this.processKadastraalObjectIdToegevoegd(e, event);
    } else if (theType === "koopprijsToegevoegd") {
      await this.processKoopprijsToegevoegd(e, event);
    } else if (theType === "datumVanLeveringToegevoegd") {
      await this.processDatumVanLeveringToegevoegd(e, event);
    } else if (
      theType === "conceptKoopovereenkomstVerkoperOpgeslagen" ||
      theType === "getekendeKoopovereenkomstKoperOpgeslagen" ||
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

    this.dataAppend({ koopprijs: "zvg:koopprijs" }, { koopprijs: e.koopprijs });
  }

  private async processDatumVanLeveringToegevoegd(e: Event, event: solidQuery) {
    Object.assign(e, {
      datumVanLevering: await event.eventData.datumVanLevering.value,
    });

    this.dataAppend(
      { datumVanLevering: "zvg:datumVanLevering" },
      { datumVanLevering: e.datumVanLevering }
    );
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

    this.dataAppend(
      {
        sor: "https://data.kkg.kadaster.nl/sor/model/def/",
        perceel: "https://data.kkg.kadaster.nl/id/perceel/",
        perceelnummer: {
          "@id": "sor:perceelnummer",
          "@type": "xsd:integer",
        },
        kadastraalObjectId: "zvg:kadastraalObjectId",
        kadastraalObject: "zvg:kadastraalObject",
      },
      {
        kadastraalObject: {
          kadastraalObjectId: e.kadastraalObjectId,
          perceelNummer: await perceel.perceelnummer.value,
        },
      }
    );
  }

  private async processKoopovereenkomstGeinitieerd(
    e: Event,
    event: solidQuery
  ) {
    Object.assign(e, { template: await event.eventData.template.value });

    if (e.template === "NVM Simple Default Koophuis") {
      this.dataAppend(
        { typeKoopovereenkomst: "zvg:typeKoopovereenkomst" },
        { typeKoopovereenkomst: "Koop" }
      );
    } else {
      throw new Error(
        `Unsupported template [${e.template}] in processing events`
      );
    }
  }

  private dataAppend(context: object, value: object): void {
    this.data = { ...this.data, ...value };
    this.dataAppendContext(context);
  }

  private dataAppendContext(context: object): void {
    this.data["@context"] = {
      ...this.data["@context"],
      ...context,
    };
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
