#!/bin/sh -e
sed s/{{BASE_URL}}/$BASE_URL/g index.html > index2.html
sed s/{{JUTE_URL}}/$JUTE_URL/g index2.html > index3.html
mv index3.html index.html

serve -n -s -l tcp://0.0.0.0:5000
