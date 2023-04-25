import {
    generateBls12381G2KeyPair,
    blsSign,
    blsVerify,
    blsCreateProof,
    blsVerifyProof,
    BlsKeyPair,
} from "@mattrglobal/bbs-signatures";
import { createContainer, getRootContainerURL, loadJson, loadText, saveJson, saveText } from "../Solid";
import { BbsBlsSignature2020, Bls12381G2KeyPair, KeyPairOptions } from "@mattrglobal/jsonld-signatures-bbs";
import bs58 from 'bs58';
import { extendContextLoader, sign, verify, purposes } from "jsonld-signatures";

import inputDocument from "./data/inputDocument.json";
import bbsContext from "./data/bbs.json";
import citizenVocab from "./data/citizenVocab.json";
import credentialContext from "./data/credentialsContext.json";
import suiteContext from "./data/suiteContext.json";

import axios, * as others from 'axios';

/* eslint-disable-next-line */
const documents = {
    "https://w3id.org/security/bbs/v1": bbsContext,
    "https://w3id.org/citizenship/v1": citizenVocab,
    "https://www.w3.org/2018/credentials/v1": credentialContext,
    "https://w3id.org/security/suites/jws-2020/v1": suiteContext,
};

/* eslint-disable-next-line */
const customDocLoader = async (url) => {
    const context = documents[url];

    if (context) {
      return {
        contextUrl: null, // this is for a context via a link header
        document: context, // this is the actual document that was loaded
        documentUrl: url, // this is the actual context URL after redirects
      };
    }

    const {data: document} = await axios.get(url);
    if (document) {
        return {
          contextUrl: null,
          document,
          documentUrl: url,
        };
    }

    console.log(
      `Attempted to remote load context : '${url}', please cache instead`
    );
    throw new Error(
      `Attempted to remote load context : '${url}', please cache instead`
    );
  };

//Extended document load that uses local contexts
/* eslint-disable-next-line */
const documentLoader = extendContextLoader(customDocLoader);


export class Signing {
    private readonly PUBLIC_FOLDER = `${getRootContainerURL()}/public`;
    private readonly PRIVATE_FOLDER = `${getRootContainerURL()}/private`;
    private readonly KEYPAIR_NAME = 'keypair1';

    private keyPair: Bls12381G2KeyPair;

    constructor() {
        this.loadOrCreateSigningKeyPair();
    }

    async loadOrCreateSigningKeyPair(): Promise<void> {
        let keyPair: Bls12381G2KeyPair;
        try {
            keyPair = await this.loadSigningKeyPair();
            console.log('keypair loaded');
        } catch (error) {
            console.error('loading keypair failed, creating new keypair', error);
            await this.createSigningContainers();
            keyPair = await this.createSigningKeyPair();
        }
        this.keyPair = keyPair;
    }

    async loadSigningKeyPair(): Promise<Bls12381G2KeyPair> {
        //Load the key pair from storage
        console.log('trying to load keypair');

        const publicKey = await loadJson(`${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.pub`);
        const privateKeyBase58 = await loadText(`${this.PRIVATE_FOLDER}/${this.KEYPAIR_NAME}`);

        return new Bls12381G2KeyPair({ ...publicKey, privateKeyBase58 });
    }

    async createSigningContainers(): Promise<void> {
        //Create the public and private folders
        await createContainer(`${this.PUBLIC_FOLDER}/`, true);
        await createContainer(`${this.PRIVATE_FOLDER}/`, false);
    }

    async createSigningKeyPair(): Promise<Bls12381G2KeyPair> {
        //Generate a new key pair
        console.log('creating new keypair')
        const keyPair = await generateBls12381G2KeyPair();

        // Convert the keys to Base58
        const publicKeyBase58 = bs58.encode(Buffer.from(keyPair.publicKey));
        const privateKeyBase58 = bs58.encode(Buffer.from(keyPair.secretKey));

        const controllerDoc = {
            "@context": "https://w3id.org/security/v2",
            "id": `${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.controller`,
            "assertionMethod": [`${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.pub`]
        }

        const publicDoc = {
            id: `${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.pub`,
            controller: `${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.controller`,
            publicKeyBase58,
        }

        // Store the key pair in storage
        await saveJson(`${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.controller`, controllerDoc);
        await saveJson(`${this.PUBLIC_FOLDER}/${this.KEYPAIR_NAME}.pub`, publicDoc);
        await saveText(`${this.PRIVATE_FOLDER}/keypair1`, privateKeyBase58);

        return new Bls12381G2KeyPair({ ...publicDoc, privateKeyBase58 });
    }

    // Sign the input document
    async signDocument(): Promise<any> {
        const purpose = new purposes.AssertionProofPurpose();
        return await sign(inputDocument, {
            suite: new BbsBlsSignature2020({ key: this.keyPair }),
            purpose,
            documentLoader,
        });
    }

    async verifyDocument(signedDocument: any): Promise<boolean> {
        return await verify(signedDocument, {
            suite: new BbsBlsSignature2020(),
            purpose: new purposes.AssertionProofPurpose(),
            documentLoader,
        });
    }

    async storeDocument(signedDocument: any): Promise<void> {
        console.log('storing document')
        const filepath = `${this.PUBLIC_FOLDER}/signedDocument.jsonld`;
        await saveJson(filepath, signedDocument);
        console.log('document stored')
    }
}
