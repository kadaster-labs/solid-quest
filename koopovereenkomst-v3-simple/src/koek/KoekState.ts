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
    koopprijs?: number;
    datumVanLevering?: string;
    kadastraalObject?: {
        perceelNummer: string;
    }
}

// Create our number formatter.
export const koopprijsFormatter = new Intl.NumberFormat('nl-nl', {
    style: 'currency',
    currency: 'EUR',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});



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
    }

    return internalState;
}