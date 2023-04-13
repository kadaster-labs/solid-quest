import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import * as jsonld from "jsonld";
import { GENERAL_CONTEXT } from "./Context";

import { Event } from "./Event";
import KoekCommandHandler from "./KoekCommandHandler";
import KoekEventHandler from "./KoekEventHandler";
import KoekRepository from "./KoekRepository";

export default class KoekAggregate {
  internalState: any = {
    "@context": {
      ...GENERAL_CONTEXT,
      zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
    },
  };

  public evntHdlr: KoekEventHandler;
  public cmdHdlr: KoekCommandHandler;

  private _id: string;

  public get id(): string {
    return this._id;
  }

  public set id(v: string) {
    this._id = v;
  }

  constructor(koekUri: string, id: string, repo: KoekRepository) {
    this._id = id;
    this.evntHdlr = new KoekEventHandler(this._id, this.stateAppend);
    this.cmdHdlr = new KoekCommandHandler(this._id, repo, this.evntHdlr);

    this.stateAppend(
      {
        iri: "zvg:koopovereenkomst-iri",
        koopovereenkomst: "zvg:koopovereenkomst",
      },
      {
        iri: koekUri,
        koopovereenkomst: {
          "@id": koekUri.split("/").pop(),
        },
      }
    );
  }

  public getEvents(): Event[] {
    return this.evntHdlr.getProcessedEvents();
  }

  public getData(): any {
    return this.internalState;
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

  private stateAppend(context: object, value: object): void {
    this.internalState = { ...this.internalState, ...value };
    this.internalState["@context"] = {
      ...this.internalState["@context"],
      ...context,
    };
  }

}

