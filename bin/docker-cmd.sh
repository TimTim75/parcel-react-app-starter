#!/bin/sh

set -e

# This script is expected to be run in the docker container ONLY
# It's editing the built JS to inject environment variables
BUILD_DIR="/home/node/app/build"
printf "Setting member app environment variables:\n\n"

check_env_var() {
  local name=$1
  if [ -z $(printenv ${name}) ]; then
    >&2 echo "ERR: ❌ Missing \$${name}"
    printf 1
  fi
  printf 0
}

validate() {
  local missing_count=0
  missing_count=$(( $(check_env_var "NODE_ENV") + ${missing_count} ))
  missing_count=$(( $(check_env_var "API_URL") + ${missing_count} ))
  missing_count=$(( $(check_env_var "SENTRY_KEY") + ${missing_count} ))
  missing_count=$(( $(check_env_var "SENTRY_ENV") + ${missing_count} ))
  missing_count=$(( $(check_env_var "HOTJAR_ID") + ${missing_count} ))

  if [ "$missing_count" -gt "0" ]; then
    printf "\nCheck the environment variables\n"
    return 1
  fi
  return 0
}

find_env_file() {
  local PATTERN="*env-variables.*.js"
  local FILES_PATH="${BUILD_DIR}/${PATTERN}"

  if [ "$(ls ${FILES_PATH} 2>/dev/null| wc -l)" -gt 1 ]; then
    >&2 printf "ERR: More than one env variable file found matching ${PATTERN}\n"
    return 1
  fi

  local FILE=$(ls ${FILES_PATH} 2>/dev/null)
  if [ -z "$FILE" ]; then
    >&2 printf "ERR: Env variable file ${FILES_PATH} not found\n"
    return 1
  fi

  printf "$FILE"
  return 0
}

prepare_env_variables() {
  local JS_VARS="NODE_ENV:\"${NODE_ENV}\""
  JS_VARS="${JS_VARS},API_URL:\"${API_URL}\""
  JS_VARS="${JS_VARS},SENTRY_KEY:\"${SENTRY_KEY}\""
  JS_VARS="${JS_VARS},SENTRY_ENV:\"${SENTRY_ENV}\""
  JS_VARS="${JS_VARS},HOTJAR_ID:\"${HOTJAR_ID}\""
  printf $JS_VARS
}

replace_file_content() {
  local FILE=$1
  local JS_VARS=$2
  if [ -z "${FILE}" ] || [ -z "${JS_VARS}" ]; then
    >&2 printf "ERR: Missing arguments for replace_file_content"
    return 1
  fi

  JS="window.dunbar_env={${JS_VARS}};"
  printf "* Replacing env variables in file with:\n"
  printf "\n${JS}\n"

  local PATTERN="window.dunbar_env={.*"
  sed -i "s#${PATTERN}#${JS}#g" "${FILE}"

  return 0
}

validate
ENV_FILE=$(find_env_file)
printf "* Found env variable file ${ENV_FILE}\n"
replace_file_content "${ENV_FILE}" $(prepare_env_variables)
printf "\nAll done!\n\n"

tail -f /dev/null
