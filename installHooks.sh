#!/bin/bash

echo 'Start install hooks'
rm .git/hooks/pre-commit
cp ./.hooks/pre-commit ./.git/hooks/pre-commit
echo 'Done'
