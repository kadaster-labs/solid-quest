import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import { callKadasterKnowledgeGraph } from "../kkg/kkgService";
import { Event } from "./Event";

export default class KoekEventHandler {
    private aggregateId: string;
    private events: Event[] = [];

    private stateAppend: (context: object, value: object) => void;

    /**
     * Constructor.
     * @param aggregateId the id of the aggregate this event listener belongs to
     * @param stateAppend internal state append method hook on aggregate
     */
    constructor(aggregateId: string, stateAppend: (context: object, value: object) => void) {
        this.aggregateId = aggregateId;
        this.stateAppend = stateAppend;
    }

    public getProcessedEvents(): Event[] {
        return this.events.sort((a, b) => a.seq - b.seq);
    }

    public async handleEvent(eventUri: solidQuery) {
        let thePod: string;
        try {
            thePod = eventUri.value.split("3001")[1].split("/")[1];
        } catch (error) {
            console.log(`error extracting POD path`, error);
        }

        const eventQuery = solidQuery[`${eventUri}`];
        let theType: string;
        for await (const t of eventQuery.type) {
            if (t.value.includes("taxonomie.zorgeloosvastgoed.nl")) {
                theType = t.value.split("#")[1];
            }
        }
        const curLabel = await eventQuery.label.value;
        const event = {
            aggregateId: this.aggregateId,
            id: eventUri.value,
            seq: await eventQuery.sequence.value,
            type: theType,
            actor: thePod,
            label: curLabel,
            time: await eventQuery.time.value,
        };

        // add dynamic label
        try {
            Object.assign(event, {
                newLabel: `${event.seq.toString().padStart(2, "0")} | ${event.time} | ${beautifyCamelCase(event.type)} for ${event.aggregateId}`,
            });
        } catch (error) {
            console.warn("building up label went wrong (somehow)", error);
        }

        if (theType === "koopovereenkomstGeinitieerd") {
            console.log(`[aggregate: ${this.aggregateId}] extract data from [${theType}] event`);
            await this.processKoopovereenkomstGeinitieerd(event, eventQuery);
        } else if (theType === "kadastraalObjectIdToegevoegd") {
            console.log(`[aggregate: ${this.aggregateId}] extract data from [${theType}] event`);
            await this.processKadastraalObjectIdToegevoegd(event, eventQuery);
        } else if (theType === "koopprijsToegevoegd") {
            console.log(`[aggregate: ${this.aggregateId}] extract data from [${theType}] event`);
            await this.processKoopprijsToegevoegd(event, eventQuery);
        } else if (theType === "datumVanLeveringToegevoegd") {
            console.log(`[aggregate: ${this.aggregateId}] extract data from [${theType}] event`);
            await this.processDatumVanLeveringToegevoegd(event, eventQuery);
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
            console.log(`[aggregate: ${this.aggregateId}] extract data from [${theType}] event`);
        } else {
            console.warn(`unsupported event in handler: [${theType}]`);
        }

        this.events.push(event);
    }

    private async processKoopprijsToegevoegd(event: Event, eventQuery: solidQuery) {
        Object.assign(event, { koopprijs: await eventQuery.eventData.koopprijs.value });

        this.stateAppend({ koopprijs: "zvg:koopprijs" }, { koopprijs: event.koopprijs });
    }

    private async processDatumVanLeveringToegevoegd(e: Event, event: solidQuery) {
        Object.assign(e, {
            datumVanLevering: await event.eventData.datumVanLevering.value,
        });

        this.stateAppend(
            { datumVanLevering: "zvg:datumVanLevering" },
            { datumVanLevering: e.datumVanLevering }
        );
    }

    private async processKadastraalObjectIdToegevoegd(event: Event, eventQuery: solidQuery) {
        Object.assign(event, {
            kadastraalObjectId: await eventQuery.eventData.kadastraalObjectId.value,
        });

        this.stateAppend(
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
                    kadastraalObjectId: event.kadastraalObjectId,
                    perceelNummer: await callKadasterKnowledgeGraph(event.kadastraalObjectId),
                },
            }
        );
    }

    private async processKoopovereenkomstGeinitieerd(event: Event, eventQuery: solidQuery) {
        Object.assign(event, { template: await eventQuery.eventData.template.value });

        if (event.template === "NVM Simple Default Koophuis") {
            this.stateAppend(
                { typeKoopovereenkomst: "zvg:typeKoopovereenkomst" },
                { typeKoopovereenkomst: "Koop" }
            );
        } else {
            throw new Error(
                `Unsupported template [${event.template}] in processing events`
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
