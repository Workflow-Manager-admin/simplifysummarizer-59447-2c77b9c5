#!/bin/bash
cd /home/kavia/workspace/code-generation/simplifysummarizer-59447-2c77b9c5/simplifysummarizer_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

