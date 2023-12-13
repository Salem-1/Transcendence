
all: help

help:
	@echo "Usage:"
	@echo "- make up"
	@echo "- make down"
	@echo "- make build"
	@echo "- make rebuild"
	@echo "- make restart"
	@echo "- make clean"

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

rebuild:
	docker compose up -d --build --force-recreate

restart:
	docker compose restart

clean: down
	docker system prune

.PHONY: help up down build rebuild restart clean
