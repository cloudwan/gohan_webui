#!/bin/bash

echo 'Start install hooks'
if [ -f .git/hooks/pre-commit ]; then
  rm .git/hooks/pre-commit
fi
cp ./.hooks/pre-commit ./.git/hooks/pre-commit
echo 'Done'
