.PHONY: help install dev build lint test test-ui preview clean

help:
	@echo "Waiter App - Available commands:"
	@echo "  make install     Install dependencies"
	@echo "  make dev         Start development server"
	@echo "  make build       Production build"
	@echo "  make lint        Run ESLint"
	@echo "  make test        Run Playwright tests"
	@echo "  make test-ui     Run tests with UI"
	@echo "  make preview     Preview production build"
	@echo "  make clean       Clean build artifacts and dependencies"
	@echo "  make all         Install, lint, test, and build"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

test:
	npm run test --reporter=list

test-ui:
	npm run test:ui

preview:
	npm run preview

clean:
	rm -rf dist node_modules .playwright-report playwright-report test-results

all: install lint test build
