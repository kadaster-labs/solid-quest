import * as vc from "@digitalbazaar/vc";

// Required to set up a suite instance with private key
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";
import { Ed25519VerificationKey2018 } from "@digitalbazaar/ed25519-verification-key-2018";

export default class VcTest {
  async run(params) {
    const keyPair = await Ed25519VerificationKey2018.generate({controller: "did:example:123"});

    console.log(`generated keypair with\npublic key:\n${keyPair.publicKeyBase58}\nand private key:\n${keyPair.privateKeyBase58}`);

    const suite = new Ed25519Signature2018({
      verificationMethod: keyPair.id,
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
      issuer: "https://example.edu/issuers/565049",
      issuanceDate: "2010-01-01T19:23:24Z",
      credentialSubject: {
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: "Example University",
      },
    };

    const signedVC = await vc.issue({ credential, suite });

    console.log(JSON.stringify(signedVC, null, 2));

    console.log('\n--------------------------------------------------------\n');

    const result = await vc.verifyCredential({ credential, suite });

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
