#!/bin/sh -e
sed -i \
    -e s/{{BASE_URL}}/$BASE_URL/g \
    -e s/{{JUTE_URL}}/$JUTE_URL/g \
    -e s/{{AI_BUILDER_URL}}/$AI_BUILDER_URL/g \
    -e s/{{FHIR_MAPPING_LANGUAGE_URL}}/$FHIR_MAPPING_LANGUAGE_URL/g \
    -e s/{{FHIRPATH_MAPPING_URL}}/$FHIRPATH_MAPPING_URL/g \
    index.html

serve -n -s -l tcp://0.0.0.0:5000
