#!/bin/bash
docker build -f Dockerfile.web.release.tpl -t bedasoftware/sdc-ide:latest .
docker push bedasoftware/sdc-ide:latest
