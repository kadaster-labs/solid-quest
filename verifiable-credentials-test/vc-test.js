import jsigs from 'jsonld-signatures';
const { purposes: { AssertionProofPurpose } } = jsigs;

import * as vc from "@digitalbazaar/vc";
import { v4 as uuid } from 'uuid';

import { documentLoader } from "./document-loader.js";

// Required to set up a suite instance with private key
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

export default class VcExample {
  async signCredential(unsignedCredential) {
    const controller = "http://localhost:8080/issuer.json";

    const keyPair = await Ed25519VerificationKey2020.generate({
      controller,
      // Make sure the keyPair.publicKeyMultibase is updated in issuer.json
      // It shouldn't change, as long as seed is kept the same
      seed: Buffer.alloc(32).fill(0)
    });

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyMultibase}\nand private key:\n${keyPair.privateKeyMultibase}`);

    const suite = new Ed25519Signature2020({ key: keyPair });
    suite.date = '2010-01-01T19:23:24Z';

    const signedCredential = await jsigs.sign(unsignedCredential, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader
    });

    return signedCredential;
  }

  async signPresentation(presentation) {
    const controller = "http://localhost:8080/holder.json";

    const keyPair = await Ed25519VerificationKey2020.generate({
      controller,
      // Make sure the keyPair.publicKeyMultibase is updated in public-key.json
      // It shouldn't change, as long as seed is kept the same
      seed: Buffer.alloc(32).fill(1)
    });

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyBase58}\nand private key:\n${keyPair.privateKeyBase58}`);

    const suite = new Ed25519Signature2020({
      key: keyPair,
    });

    console.log(JSON.stringify(presentation, null, 2));

    const challenge = uuid(); // serves to prevent presentation replay attacks

    const signedPresentation = await vc.signPresentation({
      presentation, suite, challenge, documentLoader
    });

    return { signedPresentation, challenge };
  }

  async run(params) {

    //
    // Issuer
    //

    // Sample unsigned credential
    const unsignedCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          AlumniCredential: 'https://schema.org#AlumniCredential',
          alumniOf: 'https://schema.org#alumniOf'
        }
      ],
      id: 'http://example.edu/credentials/1872',
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuer: 'http://localhost:8080/issuer.json',
      issuanceDate: '2010-01-01T19:23:24Z',
      credentialSubject: {
        id: 'https://example.edu/students/alice',
        alumniOf: 'Example University'
      }
    };

    // issuer issues a (signed) Verifiable Credential
    const signedVC = await this.signCredential(unsignedCredential);

    console.log(JSON.stringify(signedVC, null, 2));



    console.log('\n--------------------------------------------------------\n');

    //
    // Transfers securely to holder
    //

    // holder might want to verify the credential
    let suite = [new Ed25519Signature2020({
      key: new Ed25519VerificationKey2020({
        controller: signedVC.issuer,
        id: signedVC.proof.verificationMethod,
        publicKeyMultibase: signedVC.proof.verificationMethod.split('#')[1],
      })
    })];

    const credentialVerificationResult = await vc.verifyCredential(
      {
        credential: signedVC,
        suite,
        documentLoader
      }
    )
    // // Also possible, use jsigs directly:
    // const credentialVerificationResult = await jsigs.verify(
    //   signedVC,
    //   {
    //     suite,
    //     purpose: new AssertionProofPurpose(),
    //     documentLoader
    //   }
    // );

    console.log(JSON.stringify(credentialVerificationResult, null, 2));

    console.log('\n--------------------------------------------------------\n');

    // Holder creates presentation to share with verifiers
    const presentation = vc.createPresentation({
      verifiableCredential: [signedVC]
    });

    const { signedPresentation, challenge } = await this.signPresentation(presentation);

    console.log(JSON.stringify(signedPresentation, null, 2));

    console.log('\n--------------------------------------------------------\n');

    //
    // Holder transfers signed presentation and challenge securely to the verifier
    //
    // suite contains all signature suites of the enclosed VCs and the surrounding presentation
    suite = [new Ed25519Signature2020({
      key: new Ed25519VerificationKey2020({
        id: signedPresentation.proof.verificationMethod,
        controller: signedPresentation.proof.verificationMethod.split('#')[0],
        publicKeyMultibase: signedPresentation.proof.verificationMethod.split('#')[1],
      })
    }), new Ed25519Signature2020({
      key: new Ed25519VerificationKey2020({
        id: signedPresentation.verifiableCredential[0].proof.verificationMethod,
        controller: signedPresentation.verifiableCredential[0].proof.verificationMethod.split('#')[0],
        publicKeyMultibase: signedPresentation.verifiableCredential[0].proof.verificationMethod.split('#')[1],
      })
    })];

    // Verify the presentation
    const presentationVerificationResult = await vc.verify({ presentation: signedPresentation, challenge, suite, documentLoader });

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
