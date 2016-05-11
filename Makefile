all: lint tests build

.PHONY: all

tests:
	@echo "Testing..."
	npm run test-cover

build:
	@echo "Building..."
	npm run build

lint:
	@echo "Linting..."
	npm run lint
