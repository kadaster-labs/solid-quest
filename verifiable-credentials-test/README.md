# Verifiable Credentials Test

See [issue #13](https://github.com/marcvanandel/solid-quest/issues/13) for more information.

### Extra background info
- https://www.w3.org/TR/vc-data-model-2.0
- https://w3c.github.io/vc-imp-guide/

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