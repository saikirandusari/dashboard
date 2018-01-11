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

# Exit on error.
set -e

# Import config.
ROOT_DIR="$(cd $(dirname "${BASH_SOURCE}")/../.. && pwd -P)"
. "${ROOT_DIR}/aio/scripts/conf.sh"

function ensure-go-dev-tools {
  log-info "Making sure that all required Go development tools are available"
  go get golang.org/x/tools/cmd/goimports
  go get github.com/fzipp/gocyclo
  go get github.com/golang/lint/golint
  go get github.com/gordonklaus/ineffassign
  go get github.com/client9/misspell/cmd/misspell
  echo "OK!"
}

function run-gofmt {
  log-info "Running gofmt check"
  UNFORMATTED_FILES=$(gofmt -s -l ${BACKEND_SRC_DIR})
  if [[ -n "${UNFORMATTED_FILES}" ]]; then
    echo -e "Unformatted files:\n${UNFORMATTED_FILES}";
    exit 1;
  fi;
  echo "OK!"
}

function run-go-vet {
  log-info "Running go vet check"
  go vet github.com/kubernetes/dashboard/src/app/backend/...
  echo "OK!"
}

function run-gocyclo {
  log-info "Running gocyclo check"
  gocyclo -over 15 ${BACKEND_SRC_DIR}
  echo "OK!"
}

function run-golint {
  log-info "Running golint check"
  golint -set_exit_status github.com/kubernetes/dashboard/src/app/backend/...
  echo "OK!"
}

function run-misspell {
  log-info "Running misspell check"
  misspell -error ${BACKEND_SRC_DIR}
  echo "OK!"
}

function run-ineffassign {
  log-info "Running ineffassign check"
  ineffassign ${BACKEND_SRC_DIR}
  echo "OK!"
}

# Execute script.
ensure-go-dev-tools
  run-gofmt
  #run-go-vet TODO(maciaszczykm): Enable after fixing errors.
  run-gocyclo
  #run-golint TODO(maciaszczykm): Enable after fixing errors.
  run-misspell
  run-ineffassign
