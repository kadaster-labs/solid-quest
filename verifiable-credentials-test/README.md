# Verifiable Credentials Test

See [issue #13](https://github.com/marcvanandel/solid-quest/issues/13) for more information.

### Extra background info
- https://www.w3.org/TR/vc-data-model-2.0
- https://w3c.github.io/vc-imp-guide/

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