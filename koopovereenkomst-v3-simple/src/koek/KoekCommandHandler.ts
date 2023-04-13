import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import { v4 as uuidv4 } from "uuid";
import { Event } from "../../src/koek/Event";
import KoekAggregate from "./KoekAggregate";
import KoekRepository from "./KoekRepository";


export default class KoekCommandHandler {
    private aggregateId: string;
    private repo: KoekRepository;
    private koek: KoekAggregate;

    constructor(aggregateId: string, koek: KoekAggregate, repo: KoekRepository) {
        this.aggregateId = aggregateId;
        this.koek = koek;
        this.repo = repo;
    }

    public async populateWithMockEvents(): Promise<void> {
        let events = [
            {
                type: 'koopovereenkomstGeinitieerd',
                data: {
                    template: 'NVM Simple Default Koophuis',
                },
                actor: 'verkoper',
            },
            {
                type: 'kadastraalObjectIdToegevoegd',
                data: {
                    kadastraalObjectId: "10020263270000",
                },
                actor: 'verkoper',
            },
            {
                type: 'koopprijsToegevoegd',
                data: {
                    // random price between 100k and 1m
                    koopprijs: Math.floor(Math.random() * 900000) + 100000,
                },
                actor: 'verkoper',
            },
            {
                type: 'datumVanLeveringToegevoegd',
                data: {
                    datumVanLevering: new Date().toISOString(),
                },
                actor: 'verkoper',
            },
            {
                type: 'persoonsgegevensRefToegevoegd',
                data: {},
                actor: 'verkoper',
            },
            {
                type: 'persoonsgegevensRefToegevoegd',
                data: {},
                actor: 'koper-koos',
            },
            {
                type: 'conceptKoopovereenkomstKoperOpgeslagen',
                data: {},
                actor: 'koper-koos',
            },
            {
                type: 'conceptKoopovereenkomstKoperOpgeslagen',
                data: {},
                actor: 'verkoper',
            },
            {
                type: 'conceptKoopovereenkomstGetekend',
                data: {},
                actor: 'verkoper',
            },
            {
                type: 'conceptKoopovereenkomstGetekend',
                data: {},
                actor: 'koper-koos',
            },
            {
                type: 'getekendeKoopovereenkomstVerkoperOpgeslagen',
                data: {},
                actor: 'verkoper',
            },
            {
                type: 'getekendeKoopovereenkomstVerkoperOpgeslagen',
                data: {},
                actor: 'koper-koos',
            },
            {
                type: 'getekendeKoopovereenkomstKoperTerInschrijvingAangebodenBijKadaster',
                data: {},
                actor: 'koper-koos',
            },
        ];

        for (let seq = 0; seq < events.length; seq++) {
            const id = uuidv4();

            const event: Event = {
                aggregateId: this.aggregateId,
                id,
                iri: undefined,
                type: events[seq].type,
                seq: seq,
                actor: events[seq].actor,
                label: `${seq}-${events[seq].actor}-${events[seq].type}`,
                time: new Date().toISOString(),
                ...events[seq].data
            }

            await this.addEvent(event);
        }
        await this.koek.processEvents()
        await this.repo.save(this.aggregateId, this.koek.getEvents());
    }

    private async addEvent(event: Event, save = true): Promise<void> {
        if (save) {
            let filePath = await this.repo.saveEvent(event);
            try {
                this.koek.pushEvent(solidQuery[filePath]);
            } catch (error) {
                this.repo.deleteEvent(event);
            }
        }
    }

}