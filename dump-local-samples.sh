#!/bin/bash
echo "" > demo-data.ndjson

curl -H 'accept: application/json' -u root:secret 'http://localhost:8080/Patient/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:8080/Questionnaire/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:8080/Mapping/$dump' >> demo-data.ndjson

gzip demo-data.ndjson
mv demo-data.ndjson.gz  web/public/demo-data.ndjson.gz
