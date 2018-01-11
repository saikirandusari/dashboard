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

# ---------- Import config ---------- #

ROOT_DIR="$(cd $(dirname "${BASH_SOURCE}")/../.. && pwd -P)"
source "${ROOT_DIR}/aio/scripts/conf.sh"

# ---------- Define variables ---------- #

CHECK=false
# Anything larger than 0 means that check have failed
CHECK_FAILED=0
FORMAT_CODE=false
FORMAT_STYLES=false

# ---------- Define functions ---------- #

# Formats code across repository
# Includes:
#   aio (dir)
#   src (dir)
#   gulpfile.babel.js (file)
function format::code {
  find ${AIO_DIR} ${SRC_DIR} ${ROOT_DIR}/gulpfile.babel.js -type f \( -iname \*.ts -o -iname \*.js \) | \
       xargs ${CLANG_FORMAT_BIN} -i
}

# Checks if code is correctly formatted across repository
# Includes same directories as format::code function
function format::code::check {
  find ${AIO_DIR} ${SRC_DIR} ${ROOT_DIR}/gulpfile.babel.js -type f \( -iname \*.ts -o -iname \*.js \) | \
       xargs ${CLANG_FORMAT_BIN} -output-replacements-xml | grep "<replacement " >/dev/null

  if [ $? -ne 1 ] ; then
    return 1
  fi

  return 0
}

function format::styles {
  ${SCSSFMT_BIN} -r "${FRONTEND_SRC}/**/*.scss"
}

function format::styles::check {
  local needsFormat=false
  local files=($(find ${FRONTEND_SRC} -type f -name '*.scss'))
  for file in "${files[@]}"; do
    local out=$(${SCSSFMT_BIN} ${file} --diff)
    local isNotFormatted=$(echo ${out} | grep 'There is no difference')
    if [[ -z "${isNotFormatted}" ]] ; then
      needsFormat=true
    fi
  done

  if [ "${needsFormat}" = true ] ; then
    return 1
  fi

  return 0
}

function parse:args {
  POSITIONAL=()
  while [[ $# -gt 0 ]]; do
    key="$1"
    case ${key} in
      --check)
      CHECK=true
      shift
      ;;
      -c|--code)
      FORMAT_CODE=true
      shift
      ;;
      -s|--styles)
      FORMAT_STYLES=true
      shift
      ;;
    esac
  done
  set -- "${POSITIONAL[@]}" # restore positional parameters
}

# ---------- Run script ---------- #

parse:args "$@"

if [ "${CHECK}" = true ] ; then
  if [ "${FORMAT_CODE}" = true ] ; then
    format::code::check
    CHECK_FAILED=$?
    if [ "${CHECK_FAILED}" -gt 0 ]; then
      echo -e "\e[31mCode is not properly formatted. Please run 'npm run format-code'.";
      exit 1
    fi

    exit 0
  fi

  if [ "${FORMAT_STYLES}" = true ] ; then
    format::styles::check
    CHECK_FAILED=$?
    if [ "${CHECK_FAILED}" -gt 0 ]; then
      echo -e "\e[31mStyles are not properly formatted. Please run 'npm run format-styles'.";
      exit 1
    fi

    exit 0
  fi

  echo "No check param was provided."
  exit 0
fi

if [ "${FORMAT_CODE}" = true ] ; then
  format::code
  exit 0
fi

if [ "${FORMAT_STYLES}" = true ] ; then
  format::styles
  exit 0
fi

echo "No params were provided."
