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
    private webId: string;
    private actor: string;

    constructor(aggregateId: string, koek: KoekAggregate, repo: KoekRepository, webId: string) {
        this.aggregateId = aggregateId;
        this.koek = koek;
        this.repo = repo;
        this.webId = webId;
        this.actor = this.getCurrentActorFromWebId();
    }

    public async initializeWith(template: string): Promise<boolean> {
        let event = this.buildEvent(
            'koopovereenkomstGeinitieerd',
            this.actor,
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
                'verkoperRefToegevoegd',
                this.actor,
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
        let refs = this.koek.getEvents().filter((e) => e.type === "verkoperRefToegevoegd");
        return refs.filter((e) => e.verkoperRefs.includes(url)).length == 0;
    }

    public async toevoegenKoperPersoonsgegevensRef(vc: { url: string, vc: any, status: any }): Promise<boolean> {

        if (this.isNotYetKoper(vc.url)) {
            console.log('[%s] add koper vc ref url', this.aggregateId, vc.url);
            let event = this.buildEvent(
                'koperRefToegevoegd',
                'koper',
                {
                    koperRefs: [vc.url],
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] koper ref already exists for this koopovereenkomst', this.aggregateId);
        }

        return true;
    }

    private isNotYetKoper(url: string): boolean {
        let refs = this.koek.getEvents().filter((e) => e.type === "koperRefToegevoegd");
        return refs.filter((e) => e.koperRefs.includes(url)).length == 0;
    }

    public async toevoegenEigendomRef(vc: { url: string, vc: any, status: any }): Promise<boolean> {

        if (this.doesNotContainEigendomYet(vc.url)) {
            console.log('[%s] add eigendom vc ref url', this.aggregateId, vc.url);
            let event = this.buildEvent(
                'eigendomRefToegevoegd',
                this.actor,
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
        let cleanDatum = datum.hour(0).minute(0).second(0).millisecond(0).locale('nl-nl');
        if (this.isDifferentDatumVanLevering(cleanDatum)) {
            let eventType = this.koek.data.datumVanLevering ? 'datumVanLeveringGewijzigd' : 'datumVanLeveringToegevoegd';
            console.log('[%s] store datum van levering', this.aggregateId, cleanDatum);
            let event = this.buildEvent(
                eventType,
                this.actor,
                {
                    datumVanLevering: cleanDatum.format('YYYY-MM-DD'),
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] datum van levering stays the same for this koopovereenkomst', this.aggregateId);
        }
        return true;
    }

    private isDifferentDatumVanLevering(datum: Dayjs) {
        return !this.koek.data.datumVanLevering || !datum.isSame(this.koek.getDatumVanLevering());
    }

    public async koopprijsVastgesteld(koopprijs: number): Promise<boolean> {
        if (this.isDifferentKoopprijs(koopprijs)) {
            console.log('[%s] store koopprijs', this.aggregateId, koopprijs);
            let eventType = this.koek.data.koopprijs > 0 ? 'koopprijsGewijzigd' : 'koopprijsToegevoegd';
            let event = this.buildEvent(
                eventType,
                this.actor,
                {
                    koopprijs: koopprijs,
                },
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] koopprijs stays the same for this koopovereenkomst', this.aggregateId);
        }
        return true;
    }

    private isDifferentKoopprijs(koopprijs: number) {
        return this.koek.data.koopprijs != koopprijs;
    }

    public async tekenen(webId: string): Promise<boolean> {

        if (this.webId !== webId) {
            throw new Error(`Signing for a different webId is not possible!! Signing for webId [${this.webId}] with webId [${webId}]`);
        }
        if (this.isNotYetSigned(this.actor)) {
            console.log('[%s] sign for actor', this.aggregateId, this.actor);
            let event = this.buildEvent(
                'conceptKoopovereenkomstGetekend',
                this.actor,
                {}
            );
            await this.addEvent(event);
            await this.koek.processEvents();
            await this.repo.saveAggregate(this.aggregateId, this.koek.getEvents());
        }
        else {
            console.log('[%s] actor [%s] already signed for this koopovereenkomst', this.aggregateId, this.actor);
        }
        return true;
    }

    private isNotYetSigned(role: string) {
        let data = this.koek.data;
        return !data.getekend || !data.getekend.includes(role);
    }

    public async populateWithMockEvents(): Promise<void> {
        let events = [
            // {
            //     type: 'koopovereenkomstGeinitieerd',
            //     data: {
            //         template: 'NVM Simple Default Koophuis',
            //     },
            //     actor: this.getCurrentActorFromSession(),
            // },
            // {
            //     type: 'kadastraalObjectIdToegevoegd',
            //     data: {
            //         kadastraalObjectId: "10020263270000",
            //     },
            //     actor: this.getCurrentActorFromSession(),
            // },
            // {
            //     type: 'koopprijsToegevoegd',
            //     data: {
            //         // random price between 100k and 1m
            //         koopprijs: Math.floor(Math.random() * 900000) + 100000,
            //     },
            //     actor: this.getCurrentActorFromSession(),
            // },
            // {
            //     type: 'datumVanLeveringToegevoegd',
            //     data: {
            //         datumVanLevering: new Date().toISOString(),
            //     },
            //     actor: this.getCurrentActorFromSession(),
            // },
            // {
            //     type: 'verkoperRefToegevoegd',
            //     data: {
            //         verkoperRefs: ["http://localhost:3001/verkoper-vera/credentials/brp-credential.jsonld"],
            //     },
            //     actor: this.getCurrentActorFromSession(),
            // },
            {
                type: 'koperRefToegevoegd',
                data: {
                    koperRefs: ["http://localhost:3001/koper-koos/credentials/brp-credential.jsonld"],
                },
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
                actor: this.actor,
            },
            {
                type: 'conceptKoopovereenkomstGetekend',
                data: {},
                actor: this.actor,
            },
            {
                type: 'conceptKoopovereenkomstGetekend',
                data: {},
                actor: 'koper-koos',
            },
            {
                type: 'getekendeKoopovereenkomstVerkoperOpgeslagen',
                data: {},
                actor: this.actor,
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

    private getCurrentActorFromWebId(): string {
        let actor: string;
        try {
            actor = this.webId.split("3001")[1].split("/")[1];
        } catch (error) {
            console.log(`error extracting POD path`, error);
            actor = 'error';
        }
        return actor;
    }

}
