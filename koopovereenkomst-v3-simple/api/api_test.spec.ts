/**
 * VC API
 * This is an Experimental Open API Specification for the [VC Data Model](https://www.w3.org/TR/vc-data-model/).
 *
 * OpenAPI spec version: 0.0.2-unstable
 * 
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as api from "./api"
import { Configuration } from "./configuration"

const config: Configuration = {}

describe("HolderApi", () => {
  let instance: api.HolderApi
  beforeEach(function() {
    instance = new api.HolderApi(config)
  });

  test("deriveCredential", () => {
    const body: api.DeriveCredentialRequest = undefined
    return expect(instance.deriveCredential(body, {})).resolves.toBe(null)
  })
  test("provePresentation", () => {
    const body: api.ProvePresentationRequest = undefined
    return expect(instance.provePresentation(body, {})).resolves.toBe(null)
  })
})

describe("IssuerApi", () => {
  let instance: api.IssuerApi
  beforeEach(function() {
    instance = new api.IssuerApi(config)
  });

  test("issueCredential", () => {
    const body: api.IssueCredentialRequest = undefined
    return expect(instance.issueCredential(body, {})).resolves.toBe(null)
  })
  test("updateCredentialStatus", () => {
    const body: api.UpdateCredentialStatus = undefined
    return expect(instance.updateCredentialStatus(body, {})).resolves.toBe(null)
  })
})

describe("VerifierApi", () => {
  let instance: api.VerifierApi
  beforeEach(function() {
    instance = new api.VerifierApi(config)
  });

  test("verifyCredential", () => {
    const body: api.VerifyCredentialRequest = undefined
    return expect(instance.verifyCredential(body, {})).resolves.toBe(null)
  })
  test("verifyPresentation", () => {
    const body: api.PresentationsVerifyBody = undefined
    return expect(instance.verifyPresentation(body, {})).resolves.toBe(null)
  })
})
