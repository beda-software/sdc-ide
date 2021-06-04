#!/bin/bash

touch demo-data.ndjson
rm demo-data.ndjson
touch demo-data.ndjson

curl -H 'accept: application/json' -u root:secret 'http://localhost:9000/Patient/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:9000/Questionnaire/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:9000/Mapping/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:9000/AidboxQuery/$dump' >> demo-data.ndjson
curl -H 'accept: application/json' -u root:secret 'http://localhost:9000/ValueSet/$dump' >> demo-data.ndjson

gzip demo-data.ndjson
mv demo-data.ndjson.gz  web/public/demo-data.ndjson.gz
