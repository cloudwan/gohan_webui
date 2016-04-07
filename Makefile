all: lint tests build

.PHONY: all

tests:
	@echo "Testing..."
	npm run test

build:
	@echo "Building..."
	npm run build

lint:
	@echo "Linting..."
	npm run lint
