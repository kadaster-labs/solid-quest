
export async function verifyVC(vc: object): Promise<any> {
    const url = 'http://localhost:8081/credentials/verify';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "verifiableCredential": vc
        }),
    });
    const json = await response.json();
    return json
}
