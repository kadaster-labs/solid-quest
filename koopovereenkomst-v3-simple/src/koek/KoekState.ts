import { GENERAL_CONTEXT } from "./Context";

export default interface KoekState {
    "@context": object;
    iri?: string;
    koopovereenkomst?: {
        "@id": string;
    }
    template?: string;
    typeKoopovereenkomst?: string;
    aangebodenDoor?: string;
    aan?: string;
    koopprijs?: string;
    datumVanLevering?: string;
    kadastraalObject?: {
        perceelNummer: string;
    }
}

export function initState(context?: object | undefined, value?: object | undefined): KoekState {
    let internalState = {
        "@context": {
            ...GENERAL_CONTEXT,
            zvg: "http://taxonomie.zorgeloosvastgoed.nl/def/zvg#",
        },
    };
    if (value) {
        internalState = { ...internalState, ...value };
    }
    if (context) {
        internalState["@context"] = {
            ...internalState["@context"],
            ...context,
        };
        console.log('update context', internalState);
    }

    return internalState;
}