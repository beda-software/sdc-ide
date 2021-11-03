## Initial setup

### Prepare you machine

-   [Get and setup docker](https://docs.docker.com/get-docker/);

### Setup environment variables

-   Copy .env.tpl to .env
-   Specify **AIDBOX_LICENSE_ID** and **AIDBOX_LICENSE_KEY** (You can get key and id from the [https://license-ui.aidbox.app/](https://license-ui.aidbox.app/))

## Development

### amd64

```
docker-compose -f docker-compose.dev.yaml up
```

### amr64 (MAC m1)

```
docker-compose -f docker-compose.dev.yaml -f docker-compose.dev.m1.yaml up
```

### Load demo data

```
curl -u root:secret 'http://localhost:9000/$load'  -H 'content-type: application/json' --request POST --data '{"source":"https://sdc.beda.software/demo-data.ndjson.gz"}'
```
