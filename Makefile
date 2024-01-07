help:
	@echo "Usage:"
	@echo "- make [help|up|down|build|rebuild|restart|clean|reset|fclean|fresh|ps]"
	@echo ""
	@echo "Commands:"
	@echo "  help     : Show this help"
	@echo "  up       : Start containers"
	@echo "  down     : Stop containers"
	@echo "  build    : Build containers"
	@echo "  rebuild  : Rebuild containers"
	@echo "  restart  : Restart containers"
	@echo "  clean    : Stop containers and remove django images"
	@echo "  reset    : Clean and build containers"
	@echo "  fclean   : Clean and remove images"
	@echo "  fresh    : Full clean and build containers"
	@echo "  ps       : Show containers status"
	@echo ""

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
	docker rmi transcendence-django
	yes | docker system prune

reset: clean build

fclean: down
	rm -rf data
	docker rmi -f transcendence-django
	docker rmi -f transcendence-postgres
	docker rmi -f transcendence-nginx
	yes | docker system prune
	yes | docker volume prune

fresh: fclean build

ps:
	@docker compose ps

.PHONY: help up down build rebuild restart clean reset fclean fresh ps
