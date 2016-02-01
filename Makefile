all: build # test
.PHONY: all build #test

# TODO fix webui test
# test:
# 	@echo "Testing.."
# 	npm run test

build:
	@echo "Building..."
	npm run build