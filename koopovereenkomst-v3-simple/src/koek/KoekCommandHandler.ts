import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import { Dayjs } from "dayjs";
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

    public async initializeWith(template: string): Promise<boolean> {
        let event = this.buildEvent(
            'koopovereenkomstGeinitieerd',
            'verkoper',
            {
                template: template,
            },
        );
        await this.addEvent(event);
        await this.koek.processEvents();
        await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        return true;
    }

    public async toevoegenVerkoperPersoonsgegevensRef(vc: { url: string, vc: any, status: any }): Promise<boolean> {

        if (this.isNotYetVerkoper(vc.url)) {
            console.log('[%s] add verkoper vc ref url', this.aggregateId, vc.url);
            let event = this.buildEvent(
                'persoonsgegevensRefToegevoegd',
                'verkoper',
                {
                    verkoperRefs: [vc.url],
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] verkoper ref already exists for this koopovereenkomst', this.aggregateId);
        }

        return true;
    }

    private isNotYetVerkoper(url: string): boolean {
        let refs = this.koek.getEvents().filter((e) => e.type === "persoonsgegevensRefToegevoegd");
        return refs.filter((e) => e.verkoperRefs.includes(url)).length == 0;
    }

    public async toevoegenEigendomRef(vc: { url: string, vc: any, status: any }): Promise<boolean> {

        if (this.doesNotContainEigendomYet(vc.url)) {
            console.log('[%s] add eigendom vc ref url', this.aggregateId, vc.url);
            let event = this.buildEvent(
                'eigendomRefToegevoegd',
                'verkoper',
                {
                    eigendomRefs: [vc.url],
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] eigendom ref already exists for this koopovereenkomst', this.aggregateId);
        }

        return true;
    }

    private doesNotContainEigendomYet(url: string): boolean {
        let refs = this.koek.getEvents().filter((e) => e.type === "eigendomRefToegevoegd");
        return refs.filter((e) => e.eigendomRefs.includes(url)).length == 0;
    }
    public async datumVanLeveringVastgesteld(datum: Dayjs): Promise<boolean> {
        if (this.isDifferentDatumVanLevering(datum)) {
            console.log('[%s] store datum van levering', this.aggregateId, datum);
            let event = this.buildEvent(
                'datumVanLeveringToegevoegd',
                'verkoper',
                {
                    datumVanLevering: datum.toISOString(),
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        return true;
    }

    private isDifferentDatumVanLevering(datum: Dayjs) {
        return true;
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
            // const id = uuidv4();

            // const event: Event = {
            //     aggregateId: this.aggregateId,
            //     id,
            //     iri: undefined,
            //     type: events[seq].type,
            //     seq: seq,
            //     actor: events[seq].actor,
            //     label: `${seq}-${events[seq].actor}-${events[seq].type}`,
            //     time: new Date().toISOString(),
            //     ...events[seq].data
            // }

            let event = this.buildEvent(events[seq].type, events[seq].actor, events[seq].data)
            await this.addEvent(event);
        }
        await this.koek.processEvents()
        await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
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

    private buildEvent(type: string, actor: string, data: object): Event {
        let id = uuidv4();
        let seq = this.koek.getEvents().length;

        let event: Event = {
            aggregateId: this.aggregateId,
            id,
            iri: undefined,
            type: type,
            seq: seq,
            actor: actor,
            label: `${seq}-${actor}-${type}`,
            time: new Date().toISOString(),
            ...data
        }
        return event;
    }

}