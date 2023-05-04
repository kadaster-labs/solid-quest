import { GENERAL_CONTEXT } from "./Context";

import dayjs, { Dayjs } from "dayjs";
import { Event } from "./Event";
import KoekCommandHandler from "./KoekCommandHandler";
import { loadEvent, processEvent } from "./KoekEventHandler";
import KoekRepository from "./KoekRepository";
import KoekState from "./KoekState";

export default class KoekAggregate {
  internalState: KoekState = {
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

  /**
   * Checks if this Koopovereenkomst (koek) is complete.
   */
  public isComplete(): boolean {

    let result = 'aan' in this.internalState
      && 'aangebodenDoor' in this.internalState
      && 'datumVanLevering' in this.internalState
      && this.internalState.koopprijs > 0
      && this.internalState.kadastraalObject != undefined
      ;

    // console.log('[%s] isComplete: [%s]', this._id, result, this.internalState);
    return result;
  }

  public pushEvent(eventUri: string) {
    this.eventUris.push(eventUri);
  }

  public async processEvents() {
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
