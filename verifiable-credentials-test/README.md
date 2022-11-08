# Verifiable Credentials Test

See [issue #13](https://github.com/marcvanandel/solid-quest/issues/13) for more information.

### Extra background info
- https://www.w3.org/TR/vc-data-model-2.0
- https://w3c.github.io/vc-imp-guide/

Two Master's theses regarding IRMA/VC/Solid:
- https://research.ou.nl/ws/portalfiles/portal/31027221/Ostkamp_D_IM9906_AF_SE_scriptie_Pure.pdf
- https://dspace.mit.edu/bitstream/handle/1721.1/121667/1102055877-MIT.pdf

Contexts define the language used in the JSON-LDs
- https://www.w3.org/2018/credentials/v1
- https://www.w3.org/2018/credentials/examples/v1

## Install dependencies
`yarn install`

## Launch data registry

```
docker run -dit --rm \
    --name verifiable-data-registry \
    --publish 8080:80 \
    --volume "$PWD/verifiable-data-registry":/usr/local/apache2/htdocs/ \
    httpd:2.4
```

## Run example
When the data registry is running, run
```
node vc-test.js
```

In this script, a Verifiable Credential is created and verified. Also, an Verifiable Presentation is created from the VC and verified.