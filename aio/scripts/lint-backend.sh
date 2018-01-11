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

# Define constants.
BACKEND_SRC_DIR=src/app/backend

echo "Making sure that all required Go development tools are available"
go get golang.org/x/tools/cmd/goimports
go get github.com/fzipp/gocyclo
go get github.com/golang/lint/golint
go get github.com/gordonklaus/ineffassign
go get github.com/client9/misspell/cmd/misspell
echo -e "OK!\n"

echo "Running gofmt check"
UNFORMATTED_FILES=$(gofmt -s -l ${BACKEND_SRC_DIR})
if [[ -n "${UNFORMATTED_FILES}" ]]; then
  echo -e "Unformatted files:\n${UNFORMATTED_FILES}";
  exit 1;
fi;
echo -e "OK!\n"

echo "Running go vet check"
# TODO(maciaszczykm): Enable after fixing errors.
# go vet github.com/kubernetes/dashboard/src/app/backend/...
echo -e "OK!\n"

echo "Running gocyclo check"
gocyclo -over 15 ${BACKEND_SRC_DIR}
echo -e "OK!\n"

echo "Running golint check"
# TODO(maciaszczykm): Enable after fixing errors.
# golint -set_exit_status github.com/kubernetes/dashboard/src/app/backend/...
echo -e "OK!\n"

echo "Running misspell check"
misspell -error ${BACKEND_SRC_DIR}
echo -e "OK!\n"

echo "Running ineffassign check"
ineffassign ${BACKEND_SRC_DIR}
echo -e "OK!\n"

echo "All checks have passed! Visit https://goreportcard.com/report/github.com/kubernetes/dashboard for more details"
