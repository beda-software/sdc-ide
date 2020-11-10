#!/bin/sh

mkdir -p /root/.kube/
echo "$K8S_CONFIG" > /root/.kube/config
export KUBECONFIG=/root/.kube/config
export NAMESPACE="${CI_PROJECT_NAMESPACE}-${CI_COMMIT_REF_SLUG}"
kubectl config use-context default

EXTRA_HELM_ARGS=""

if [ "${CI_COMMIT_REF_SLUG}" == "production" ]; then
    EXTRA_HELM_ARGS="--set service.additionalHosts[0]=${KUBE_INGRESS_BASE_DOMAIN}"
fi

# TODO: add KUBE_INGRESS_BASE_DOMAIN to README.md
# TODO: group naming

helm upgrade --install \
     --wait \
     --namespace $NAMESPACE \
     --set service.enabled=true \
     --set gitlab.app="$CI_PROJECT_PATH_SLUG" \
     --set gitlab.env="$CI_COMMIT_REF_SLUG" \
     --set releaseOverride="$CI_COMMIT_REF_SLUG" \
     --set image.repository="${CI_REGISTRY_IMAGE}" \
     --set image.tag="$CI_COMMIT_REF_SLUG" \
     --set image.hash="$CI_COMMIT_SHA" \
     --set image.secrets[0].name=gitlab-registry \
     --set application.track="$CI_COMMIT_REF_SLUG" \
     --set service.url="${CI_COMMIT_REF_SLUG}.${KUBE_INGRESS_BASE_DOMAIN}"\
     --set replicaCount=1 \
     ${EXTRA_HELM_ARGS} \
     "${CI_PROJECT_PATH_SLUG}-${CI_COMMIT_REF_SLUG}" \
     .
