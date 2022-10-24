import * as vc from "@digitalbazaar/vc";

import { documentLoader } from "./document-loader.js";

// Required to set up a suite instance with private key
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";
import { Ed25519VerificationKey2018 } from "@digitalbazaar/ed25519-verification-key-2018";

export default class VcTest {
  async run(params) {
    const controller = "http://localhost:8080/creator.json";
    
    const keyPair = await Ed25519VerificationKey2018.generate({
      id: "http://localhost:8080/public-key.json",
      controller,
      // Make sure the keyPair.publicKeyBase58 is updated in public-key.json
      // It shouldn't change, as long as seed is kept the same
      seed: Buffer.alloc(32).fill(0)
    });

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyBase58}\nand private key:\n${keyPair.privateKeyBase58}`);

    const suite = new Ed25519Signature2018({
      key: keyPair,
    });

    // Sample unsigned credential
    const credential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      id: "https://example.com/credentials/1872",
      type: ["VerifiableCredential", "AlumniCredential"],
      issuer: controller,
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: "Example University",
      },
    };

    const signedVC = await vc.issue({ credential, suite, documentLoader });

    console.log(JSON.stringify(signedVC, null, 2));

    console.log('\n--------------------------------------------------------\n');

    const result = await vc.verifyCredential({ credential: signedVC, suite, documentLoader });

    console.log(JSON.stringify(result, null, 2));
  }
}

const vcTest = new VcTest();

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
