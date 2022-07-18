#!/bin/sh -e
sed s/{{BASE_URL}}/$BASE_URL/g index.html > index2.html
mv index2.html index.html

serve -n -l tcp://0.0.0.0:5000
