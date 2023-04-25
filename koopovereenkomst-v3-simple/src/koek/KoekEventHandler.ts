import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import { getFile } from "../Solid";
import { callKadasterKnowledgeGraph } from "../kkg/kkgService";
import { Event } from "./Event";
import KoekState, { initState } from "./KoekState";

export async function loadEvent(eventUri: solidQuery): Promise<[solidQuery, Event]> {
    let thePod: string;
    try {
        thePod = eventUri.value.split("3001")[1].split("/")[1];
    } catch (error) {
        console.log(`error extracting POD path`, error);
    }

    let eventQuery = solidQuery[`${eventUri}`];
    // eventQuery.context.extend(SOLID_ZVG_CONTEXT);
    let theType: string;
    for await (let t of eventQuery.type) {
        if (t.value.includes("taxonomie.zorgeloosvastgoed.nl")) {
            theType = t.value.split("#")[1];
        }
    }
    let aggregateId = await eventQuery.aggregateIdentifier.value;
    let curLabel = await eventQuery.label.value;
    let event = {
        aggregateId: aggregateId.split("/").pop(),
        id: eventUri.value,
        iri: eventUri,
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
    return [eventQuery, event];
}

export async function processEvent(eventQuery: solidQuery, event: Event): Promise<KoekState> {
    let theType = event.type;
    let aggregateId = event.aggregateId;

    if (theType === "koopovereenkomstGeinitieerd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processKoopovereenkomstGeinitieerd(event, eventQuery);
    } else if (theType === "kadastraalObjectIdToegevoegd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processKadastraalObjectIdToegevoegd(event, eventQuery);
    } else if (theType === "koopprijsToegevoegd" || theType === "koopprijsGewijzigd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processKoopprijsToegevoegd(event, eventQuery);
    } else if (theType === "datumVanLeveringToegevoegd" || theType === "datumVanLeveringGewijzigd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processDatumVanLeveringToegevoegd(event, eventQuery);
    } else if (theType === "verkoperRefToegevoegd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processVerkoperRefToegevoegd(event, eventQuery);
    } else if (theType === "koperRefToegevoegd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processKoperRefToegevoegd(event, eventQuery);
    } else if (theType === "eigendomRefToegevoegd") {
        console.log(`[aggregate: ${aggregateId}] extract data from [${theType}] event`);
        return await processEigendomRefToegevoegd(event, eventQuery);
    } else if (
        theType === "conceptKoopovereenkomstVerkoperOpgeslagen" ||
        theType === "getekendeKoopovereenkomstKoperOpgeslagen" ||
        theType === "conceptKoopovereenkomstKoperOpgeslagen" ||
        theType ===
        "getekendeKoopovereenkomstKoperTerInschrijvingAangebodenBijKadaster" ||
        theType === "getekendeKoopovereenkomstVerkoperOpgeslagen" ||
        theType === "conceptKoopovereenkomstGetekend"
    ) {
        console.log(`[aggregate: ${aggregateId}] skip [${theType}] event`);
    } else {
        console.warn(`unsupported event in handler: [${theType}]`);
    }
    return initState();
}



async function processKoopprijsToegevoegd(event: Event, eventQuery: solidQuery): Promise<KoekState> {
    Object.assign(event, { koopprijs: await eventQuery.eventData.koopprijs.value });

    return initState({ koopprijs: "zvg:koopprijs" }, { koopprijs: event.koopprijs });
}

async function processDatumVanLeveringToegevoegd(e: Event, event: solidQuery): Promise<KoekState> {
    Object.assign(e, {
        datumVanLevering: await event.eventData.datumVanLevering.value,
    });

    return initState({ datumVanLevering: "zvg:datumVanLevering" }, { datumVanLevering: e.datumVanLevering });
}

async function processKadastraalObjectIdToegevoegd(event: Event, eventQuery: solidQuery): Promise<KoekState> {
    Object.assign(event, {
        kadastraalObjectId: await eventQuery.eventData.kadastraalObjectId.value,
    });

    let perceel = await callKadasterKnowledgeGraph(event.kadastraalObjectId);

    return initState({
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
                perceelNummer: perceel.perceelNummer,
            },
        });
}

const supportedTemplates = [
    "NVM Standaard Koopovereenkomst Koophuis",
    "NVM Simple Default Koophuis",
];

async function processKoopovereenkomstGeinitieerd(event: Event, eventQuery: solidQuery): Promise<KoekState> {
    Object.assign(event, { template: await eventQuery.eventData.template.value });

    if (supportedTemplates.includes(event.template)) {
        return initState({ typeKoopovereenkomst: "zvg:typeKoopovereenkomst" }, { typeKoopovereenkomst: "Koop" });
    } else {
        throw new Error(
            `Unsupported template [${event.template}] in processing events`
        );
    }
}

async function processVerkoperRefToegevoegd(event: Event, eventQuery: solidQuery): Promise<KoekState> {

    let refs = [];
    for await (const ref of eventQuery.eventData.verkoper) {
        refs.push(ref.value);
    }
    Object.assign(event, { verkoperRefs: refs });

    let vc = await retrieveVC(event.verkoperRefs[0]);
    return initState({ aangebodenDoor: "zvg:aangebodenDoor" }, { aangebodenDoor: vc.credentialSubject.naam });
}

async function processKoperRefToegevoegd(event: Event, eventQuery: solidQuery): Promise<KoekState> {

    let refs = [];
    for await (const ref of eventQuery.eventData.koper) {
        refs.push(ref.value);
    }
    Object.assign(event, { koperRefs: refs });

    let vc = await retrieveVC(event.koperRefs[0]);
    return initState({ aan: "zvg:aan" }, { aan: vc.credentialSubject.naam });
}

async function processEigendomRefToegevoegd(event: Event, eventQuery: solidQuery): Promise<KoekState> {

    let refs = [];
    for await (const ref of eventQuery.eventData.eigendom) {
        refs.push(ref.value);
    }
    Object.assign(event, { eigendomRefs: refs });

    let vc = await retrieveVC(event.eigendomRefs[0]);

    Object.assign(event, {
        kadastraalObjectId: vc.credentialSubject.eigendom.perceel.identificatie as string,
    });

    let perceel = await callKadasterKnowledgeGraph(event.kadastraalObjectId);

    return initState({
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
                perceelNummer: perceel.perceelNummer,
            },
        });
}

async function retrieveVC(uri: string): Promise<any> {
    const file = await getFile(uri);
    const text = await file.text();
    const credential = JSON.parse(text);
    return credential;
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
