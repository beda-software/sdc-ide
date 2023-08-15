#!/bin/sh

if [ -f ".env.test.local" ]; then
    export `cat .env.test.local`
fi

if [ -z "${AIDBOX_LICENSE}" ]; then
    echo "AIDBOX_LICENSE is required to run tests"
    exit 1
fi

COMPOSE_FILES="-f docker-compose.tests.yaml"

docker-compose $COMPOSE_FILES pull
docker-compose $COMPOSE_FILES up -d
curl -u root:secret 'http://localhost:8181/$load'  -H 'content-type: application/json' --request POST --data '{"source":"https://sdc.beda.software/demo-data.ndjson.gz"}'

yarn test $@
