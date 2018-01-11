#!/usr/bin/env bash
# Copyright 2017 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Import config.
ROOT_DIR="$(cd $(dirname "${BASH_SOURCE}")/../.. && pwd -P)"
. "${ROOT_DIR}/aio/scripts/conf.sh"

# Declare functions.
function ensure-cache {
  log-info "Making sure that ${CACHE_DIR} directory exists"
  mkdir -p ${CACHE_DIR}
}

function download-minikube {
  log-info "Downloading minikube ${MINIKUBE_VERSION} if it is not cached"
  wget -nc -O ${MINIKUBE_BIN} https://storage.googleapis.com/minikube/releases/${MINIKUBE_VERSION}/minikube-${ARCH}-amd64
  chmod +x ${MINIKUBE_BIN}
  ${MINIKUBE_BIN} version
}

function ensure-kubeconfig {
  log-info "Making sure that kubeconfig file exists and will be used by Dashboard"
  mkdir -p $HOME/.kube
  touch $HOME/.kube/config
}

function configure-minikube {
  log-info "Configuring minikube"
  export MINIKUBE_HOME=${HOME}
  sudo -E ${MINIKUBE_BIN} config set WantUpdateNotification false
  sudo -E ${MINIKUBE_BIN} config set WantReportErrorPrompt false
  sudo -E ${MINIKUBE_BIN} config set WantKubectlDownloadMsg false
}

function start-ci-minikube {
  log-info "Starting continous integration cluster"
  export CHANGE_MINIKUBE_NONE_USER=true
  sudo -E ${MINIKUBE_BIN} start --vm-driver=none --kubernetes-version=${MINIKUBE_K8S_VERSION}
}

function start-ci-heapster {
  log-info "Running heapster in standalone mode"
  docker run --net=host -d k8s.gcr.io/heapster-amd64:${HEAPSTER_VERSION} \
             --heapster-port ${HEAPSTER_PORT} \
             --source=kubernetes:http://127.0.0.1:8080?inClusterConfig=false&auth=""

  log-info "Waiting for heapster to be started"
  for i in {1..150}
  do
    HEAPSTER_STATUS=$(curl -sb -H "Accept: application/json" "127.0.0.1:${HEAPSTER_PORT}/healthz")
    if [ "$HEAPSTER_STATUS" == "ok" ]; then
      break
    fi
    sleep 2
  done
  log-info "Heapster is up and running"
}

function start-local-minikube {
  log-info "Starting local cluster"
  sudo -E ${MINIKUBE_BIN} start --kubernetes-version=${MINIKUBE_K8S_VERSION}
}

function start-minikube {
  if [ "${CI}" = true ] ; then
    start-ci-minikube
    start-ci-heapster
  else
    start-local-minikube
  fi
  log-info "Kubernetes cluster is ready to use"
}

# Execute script.
ensure-cache
download-minikube
ensure-kubeconfig
configure-minikube
start-minikube
