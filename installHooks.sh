#!/bin/bash

echo 'Start install hooks'
rm .git/hooks/pre-commit
rm .git/hooks/.jscsrc
cp ./.hooks/pre-commit ./.git/hooks/pre-commit
cp ./.jscsrc ./.git/hooks/.jscsrc
echo 'Done'
