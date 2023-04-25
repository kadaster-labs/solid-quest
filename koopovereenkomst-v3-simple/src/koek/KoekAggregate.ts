import * as jsonld from "jsonld";
import { GENERAL_CONTEXT } from "./Context";

import dayjs, { Dayjs } from "dayjs";
import { Event } from "./Event";
import KoekCommandHandler from "./KoekCommandHandler";
import { loadEvent, processEvent } from "./KoekEventHandler";
import KoekRepository from "./KoekRepository";
import KoekState from "./KoekState";

export default class KoekAggregate {
  internalState: any = {
    "@context": {
      ...GENERAL_CONTEXT,
      zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
    },
  };

  public cmdHdlr: KoekCommandHandler;

  private _id: string;
  private events: Event[];

  public get id(): string {
    return this._id;
  }

  private eventUris: string[] = [];

  constructor(koekUri: string, id: string, repo: KoekRepository, webId: string) {
    this._id = id;
    this.cmdHdlr = new KoekCommandHandler(this._id, this, repo, webId);

    this.internalState = this.appendState(this.internalState, {
      "@context": {
        iri: "zvg:koopovereenkomst-iri",
        koopovereenkomst: "zvg:koopovereenkomst",
      },
      iri: koekUri,
      koopovereenkomst: {
        "@id": koekUri.split("/").pop(),
      },
    });
  }

  public get data(): KoekState {
    return this.internalState;
  }

  public pushEvent(eventUri: string) {
    this.eventUris.push(eventUri);
  }

  public async processEvents() {
    console.log(`[${this._id}] process events!!`);
    let loadedEvents = (
      await Promise.all(this.eventUris
        .map(loadEvent)))
      .sort((a, b) => a[1].seq - b[1].seq);
    this.events = loadedEvents
      .map(v => v[1]);
    let l = await Promise.all(loadedEvents
      .map(async (q) => await processEvent(await q[0], q[1])));
    this.internalState = l
      .reduce(this.appendState, this.internalState)
    console.log(`[${this._id}] loaded state: `, this.internalState);
  }

  public getEvents(): Event[] {
    return this.events;
  }

  public getDatumVanLevering(): Dayjs {
    return dayjs(this.internalState.datumVanLevering);
  }

  public async dumpJsonLD(): Promise<object> {
    const p = new Promise<object>((resolve, reject) => {
      resolve(this.internalState);
    });
    return p;
  }

  public async dumpNQuads(): Promise<string> {
    return await jsonld.toRDF(this.internalState, { format: "application/n-quads" });
  }

  private appendState(cumState: KoekState, state: KoekState): KoekState {
    let stateContext = {
      ...cumState["@context"],
      ...state["@context"],
    };
    let getekendState = [].concat(cumState["getekend"]).concat(state["getekend"]);
    cumState = { ...cumState, ...state, };
    cumState["@context"] = stateContext;
    cumState["getekend"] = getekendState;
    return cumState;
  }
}
