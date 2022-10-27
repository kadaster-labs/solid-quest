import * as vc from "@digitalbazaar/vc";
import { v4 as uuid } from 'uuid';

import { documentLoader } from "./document-loader.js";

// Required to set up a suite instance with private key
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";
import { Ed25519VerificationKey2018 } from "@digitalbazaar/ed25519-verification-key-2018";

export default class VcExample {
  async signCredential(credential) {
    const controller = "http://localhost:8080/issuer.json";

    const keyPair = await Ed25519VerificationKey2018.generate({
      id: "http://localhost:8080/issuer-key.json",
      controller,
      // Make sure the keyPair.publicKeyBase58 is updated in public-key.json
      // It shouldn't change, as long as seed is kept the same
      seed: Buffer.alloc(32).fill(0)
    });

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyBase58}\nand private key:\n${keyPair.privateKeyBase58}`);

    const suite = new Ed25519Signature2018({
      key: keyPair,
    });


    const signedVC = await vc.issue({ credential, suite, documentLoader });

    return signedVC;
  }

  async signPresentation(presentation) {
    const controller = "http://localhost:8080/holder.json";

    const keyPair = await Ed25519VerificationKey2018.generate({
      id: "http://localhost:8080/holder-key.json",
      controller,
      // Make sure the keyPair.publicKeyBase58 is updated in public-key.json
      // It shouldn't change, as long as seed is kept the same
      seed: Buffer.alloc(32).fill(1)
    });

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyBase58}\nand private key:\n${keyPair.privateKeyBase58}`);

    const suite = new Ed25519Signature2018({
      key: keyPair,
    });

    console.log(JSON.stringify(presentation, null, 2));

    const challenge = uuid(); // serves to prevent presentation replay attacks

    const signedPresenation = await vc.signPresentation({
      presentation, suite, challenge, documentLoader
    });

    return { signedPresenation, challenge };
  }

  async run(params) {

    //
    // Issuer
    //

    // Sample unsigned credential
    const credential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://labs.kadaster.nl/assets/json-ld/brt/0.0/brt.jsonld",
      ],
      id: "https://example.com/credentials/1872",
      type: ["VerifiableCredential", "RelationshipCredential"],
      issuer: "http://localhost:8080/issuer.json",
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: [{
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "name": "Jayden Doe",
        "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
      }, {
        "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
        "name": "Morgan Doe",
        "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21"
      }],
    };

    // issuer issues a (signed) Verifiable Credential
    const signedVC = await this.signCredential(credential);

    console.log(JSON.stringify(signedVC, null, 2));



    console.log('\n--------------------------------------------------------\n');

    //
    // Transfers securely to holder
    //

    // holder might want to verify the credential
    let suite = [new Ed25519Signature2018({
      key: new Ed25519VerificationKey2018({
        controller: signedVC.issuer,
        id: signedVC.proof.verificationMethod,
        // publicKeyBase58 can be looked up in signedVC.proof.verificationMethod
        publicKeyBase58: "4zvwRjXUKGfvwnParsHAS3HuSVzV5cA4McphgmoCtajS",
      })
    })];

    const credentialVerificationResult = await vc.verifyCredential({
      credential: signedVC,
      suite,
      documentLoader
    });

    console.log(JSON.stringify(credentialVerificationResult, null, 2));

    console.log('\n--------------------------------------------------------\n');

    // Holder creates presentation to share with verifiers
    const presentation = vc.createPresentation({
      verifiableCredential: [credential]
    });

    const { signedPresenation, challenge } = await this.signPresentation(presentation);

    console.log(JSON.stringify(signedPresenation, null, 2));

    console.log('\n--------------------------------------------------------\n');

    //
    // Holder transfers signed presentation and challenge securely to the verifier
    //
    // suite contains all signature suites of the enclosed VCs and the surrounding presentation
    suite = [new Ed25519Signature2018({
      key: new Ed25519VerificationKey2018({
        controller: "http://localhost:8080/holder.json",
        id: signedPresenation.proof.verificationMethod,
        // publicKeyBase58 can be looked up in signedVC.proof.verificationMethod
        publicKeyBase58: "AKnL4NNf3DGWZJS6cPknBuEGnVsV4A4m5tgebLHaRSZ9",
      })
    }), new Ed25519Signature2018({
      key: new Ed25519VerificationKey2018({
        controller: signedPresenation.verifiableCredential[0].issuer,
        id: signedPresenation.verifiableCredential[0].proof.verificationMethod,
        // publicKeyBase58 can be looked up in
        // signedPresenation.verifiableCredential[0].proof.verificationMethod
        publicKeyBase58: "4zvwRjXUKGfvwnParsHAS3HuSVzV5cA4McphgmoCtajS",
      })
    })];

    // Verify the presentation
    const presentationVerificationResult = await vc.verify({ presentation: signedPresenation, challenge, suite, documentLoader });

    console.log(JSON.stringify(presentationVerificationResult, null, 2));
  }
}

const vcTest = new VcExample();

vcTest.run().catch((e) => {
  console.error(e);
  process.exit(1);
});
process.on("uncaughtException", function (err) {
  console.error("Uncaught exception", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
