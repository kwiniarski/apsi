#!/usr/bin/env bash

CODECLIMATE_FILE=codeclimate.txt
CODECLIMATE_BIN=node_modules/codeclimate-test-reporter/bin/codeclimate.js
COVERAGE_FILE=.coverage/lcov.info

if [[ -z "$CODECLIMATE_REPO_TOKEN" ]]; then
  if [[ -f $CODECLIMATE_FILE ]]; then
    CODECLIMATE_REPO_TOKEN=$(<$CODECLIMATE_FILE)
  else
    echo "CodeClimate token not found!"
    exit 1;
  fi
fi

bash -c "CODECLIMATE_REPO_TOKEN=$CODECLIMATE_REPO_TOKEN node $CODECLIMATE_BIN < $COVERAGE_FILE";
exit 0;

