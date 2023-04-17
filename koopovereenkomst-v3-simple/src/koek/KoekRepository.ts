import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import * as solid from "../Solid";
import { Aggregate2RDF, event2RDF } from "../rdfWriter";
import { Event } from "./Event";
import KoekAggregate from "./KoekAggregate";


export default class KoekRepository {

    private rootContainerUrl: string;
    private logboekContainer: string;
    private eventContainer: string;

    constructor(rootContainerUrl: string = solid.getRootContainerURL()) {
        this.rootContainerUrl = rootContainerUrl;
        this.logboekContainer = `${rootContainerUrl}/koopovereenkomst/id`;
        this.eventContainer = `${rootContainerUrl}/koopovereenkomst/events/id`;
    }

    public async list(): Promise<Array<string>> {
        let koekUrls = await solid.getAllFileUrls(this.logboekContainer);
        let ids = koekUrls.map((file) => file.split('/').pop());
        return ids;
    }

    public async create(): Promise<string> {
        let randomId = (Math.floor(Math.random() * 100000) + 1000).toString();

        let filepath = `${this.logboekContainer}/${randomId}`;
        await solid.saveTurtle(filepath, `
          @prefix koopovereenkomst: <> .
          @prefix zvg: <http://taxonomie.zorgeloosvastgoed.nl/def/zvg#> .
    
          koopovereenkomst:
            a zvg:Koop .
        `);

        return randomId;
    }

    public async load(koekId: string): Promise<KoekAggregate> {
        try {
            let koekUri = `${this.logboekContainer}/${koekId}`;
            let aggregate = new KoekAggregate(koekUri, koekId, this);
            let koekQuery = solidQuery[koekUri];
            try {
                for await (let eventUri of koekQuery.wasGeneratedBy) {
                    aggregate.pushEvent(eventUri);
                }
                await aggregate.processEvents();
            } catch (e) {
                console.error(e);
            }
            return aggregate;
        } catch (error) {
            console.error(`Error loading aggregate [id: ${koekId}, root: ${this.logboekContainer}]`, error);
            throw error;
        }
    }

    public async saveEvent(event: Event): Promise<string> {
        const eventContainer = event.actor === "koper-koos" ? `http://localhost:3001/koper-koos/koopovereenkomst/events/id` : this.eventContainer;

        const rdfEvent = event2RDF(event, {
            vlbContainer: this.logboekContainer,
            eventContainer,
        });

        const filepath = `${eventContainer}/${event.id}`;
        await solid.saveTurtle(filepath, rdfEvent);

        return filepath;
    }

    public async save(aggregateId: string, events: Event[]): Promise<void> {
        const rdf = Aggregate2RDF(aggregateId, events, {
            vlbContainer: this.logboekContainer,
            eventContainer: this.eventContainer,
        });
        const filepath = `${this.logboekContainer}/${aggregateId}`;
        await solid.saveTurtle(filepath, rdf);
    }

    public async deleteEvent(event: Event) {
        await solid.deleteFile(event.id);
    }

}