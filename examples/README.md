## Initial setup

### Prepare you machine

-   [Get and setup docker](https://docs.docker.com/get-docker/);

### Setup environment variables

-   Copy .env.tpl to .env
-   Specify **AIDBOX_LICENSE_ID** and **AIDBOX_LICENSE_KEY** (You can get key and id from the [https://license-ui.aidbox.app/](https://license-ui.aidbox.app/))

## Launch compiled docker images

-   Run `docker-compose -f docker-compose.production.yaml up`
-   It may take a few minutes for the environment to warm up, please wait untile docker-compose stops firing logs
-   Open http://localhost:5000 in the browser