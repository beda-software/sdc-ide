## Initial setup

### Prepare you machine

-   [Get and setup docker](https://docs.docker.com/get-docker/);

### Setup environment variables

-   Copy .env.tpl to .env
-   Specify **AIDBOX_LICENSE** (You can get key and id from the [https://aidbox.app/](https://aidbox.app/))

## Development

```
docker compose -f docker-compose.dev.yaml up
```

Open `http://localhost:3001` and follow the sign in process.
