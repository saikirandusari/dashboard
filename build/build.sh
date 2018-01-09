#!/bin/bash

PROJECT_DIR=$(pwd)/..
I18N_DIR=${PROJECT_DIR}/i18n
NG_BIN=${PROJECT_DIR}/node_modules/.bin/ng
TMP_DIR=${PROJECT_DIR}/.tmp
OUT_DIR=${PROJECT_DIR}/dist

# Make sure that OUT_DIR exists and is empty
rm -rf ${OUT_DIR}
mkdir -p ${OUT_DIR}

# Remove temp dir
rm -rf ${TMP_DIR}

echo Building frontend for default locale: en
mkdir -p ${TMP_DIR}/frontend/en
${NG_BIN} build --aot --prod --outputPath=${TMP_DIR}/frontend/en

# Build frontend for additional supported locales
languages=($(ls ${I18N_DIR} | awk -F. '{print $2}'))
for language in "${languages[@]}"; do
  if [[ ${language} != xlf ]]; then
    mkdir -p ${TMP_DIR}/frontend/${language}
    echo Building frontend for locale: ${language}
    ${NG_BIN} build --aot --prod --i18nFile=${I18N_DIR}/messages.${language}.xlf --i18nFormat=xlf \
      --locale=${language} --outputPath=${TMP_DIR}/frontend/${language}
  fi
done
