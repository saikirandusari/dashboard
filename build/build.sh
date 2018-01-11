#!/usr/bin/env bash

# Exit on error
set -e

# ---------- Define constants ---------- #

BUILD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(dirname "BUILD_DIR")
I18N_DIR=${ROOT_DIR}/i18n
NG_BIN=${ROOT_DIR}/node_modules/.bin/ng
GULP_BIN=${ROOT_DIR}/node_modules/.bin/gulp
TMP_DIR=${ROOT_DIR}/.tmp
FRONTEND_DIR=${TMP_DIR}/frontend
DIST_DIR=${ROOT_DIR}/dist

# ---------- Define variables ---------- #

CROSS=false
FRONTEND_ONLY=false

# ---------- Define functions ---------- #

function clean {
  rm -rf ${DIST_DIR} ${TMP_DIR}
}

function build:frontend {
  echo "Building frontend for default locale: en"
  mkdir -p ${FRONTEND_DIR}/en
  ${NG_BIN} build --aot --prod --outputPath=${TMP_DIR}/frontend/en

  languages=($(ls i18n | awk -F"." '{if (NF>2) print $2}'))
  for language in "${languages[@]}"; do
    mkdir -p ${FRONTEND_DIR}/${language}

    echo "Building frontend for locale: ${language}"
    ${NG_BIN} build --aot \
                    --prod \
                    --i18nFile=${I18N_DIR}/messages.${language}.xlf \
                    --i18nFormat=xlf \
                    --locale=${language} --outputPath=${TMP_DIR}/frontend/${language}
  done
}

function build:backend {
  echo "Building backend"
  ${GULP_BIN} backend:prod
}

function build:backend:cross {
  echo "Building backends for all supported architectures"
  ${GULP_BIN} backend:prod:cross
}

function copy:frontend {
  echo "Copying frontend to backend dist dir"
  languages=($(ls ${FRONTEND_DIR}))
  architectures=($(ls ${DIST_DIR}))
  for arch in "${architectures[@]}"; do
    for language in "${languages[@]}"; do
      OUT_DIR=${DIST_DIR}/${arch}/public
      mkdir -p ${OUT_DIR}
      cp -r ${FRONTEND_DIR}/${language} ${OUT_DIR}
    done
  done
}

function copy:supported-locales {
  echo "Copying locales file to backend dist dir"
  architectures=($(ls ${DIST_DIR}))
  for arch in "${architectures[@]}"; do
    OUT_DIR=${DIST_DIR}/${arch}
    cp ${I18N_DIR}/locale_conf.json ${OUT_DIR}
  done
}

function parse:args {
  POSITIONAL=()
  while [[ $# -gt 0 ]]; do
    key="$1"
    case ${key} in
      -c|--cross)
      CROSS=true
      shift
      ;;
      --frontend-only)
      FRONTEND_ONLY=true
      shift
      ;;
    esac
  done
  set -- "${POSITIONAL[@]}" # restore positional parameters
}
# ---------- Run script ---------- #

START=$(date +%s.%N)

parse:args "$@"
clean

if [ "${FRONTEND_ONLY}" = true ] ; then
  build:frontend
  exit
fi

if [ "${CROSS}" = true ] ; then
  build:backend:cross
else
  build:backend
fi

build:frontend
copy:frontend
copy:supported-locales

END=$(date +%s.%N)
TOOK=$(echo "$END - $START" | bc)
echo "Build finished successfully after ${TOOK}s"
