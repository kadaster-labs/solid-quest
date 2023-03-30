import { SolidAddress, SolidPerson } from "./Solid";


export async function checkIfWebIDIsReady(
    webID: string
): Promise<boolean> {
    const encodedwebID = encodeURIComponent(webID);
    const url = 'http://localhost:8080/dataplein/checkWebID/' + encodedwebID;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.status === 200;
}

export async function registerWebID(
    webID: string,
    person: SolidPerson,
    address: SolidAddress
): Promise<boolean> {
    const encodedwebID = encodeURIComponent(webID);
    const url = 'http://localhost:8080/dataplein/registerWebID/' + encodedwebID;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            person,
            address,
        }),
    });

    return response.status === 200;
}
