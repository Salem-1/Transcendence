help:
	@echo "Usage:"
	@echo "- make [help|up|down|build|rebuild|restart|clean|reset|fclean|fresh|ps]"
	@echo ""
	@echo "Commands:"
	@echo "  help            : Show this help"
	@echo "  up              : Start containers"
	@echo "  down            : Stop containers"
	@echo "  build           : Build containers"
	@echo "  rebuild         : Rebuild containers"
	@echo "  restart         : Restart containers"
	@echo "  clean           : Stop containers and remove django images"
	@echo "  reset           : Clean and build containers"
	@echo "  fclean          : Clean and remove images"
	@echo "  fresh           : Full clean and build containers"
	@echo "  ps              : Show containers status"
	@echo "  test            : Run backend and frontend tests"
	@echo "  test_backend    : Run backend  tests"
	@echo "  test_mini  	 : Run  backend mini_test.py only"
	@echo "  test_frontend   : Run  frontend tests using selenium (make sure node is installed first)"
	@echo "  logs	    	 : Show Django logs"
	@echo "  lognginx        : Show Ngninx logs"
	@echo "  logdjango        : Show Django logs"
	@echo "  waflog          : Show firewall logs"
	@echo ""

unseal:
	@echo please use key to run the project
	@docker exec -it vault bash

up: run unseal 

run:
	@docker compose up -d
	
down:
	@docker compose down

build: construct unseal

construct:
	@docker compose up -d --build

rebuild: construct unseal

reconstruct:
	@docker compose up -d --build --force-recreate

restart:
	@docker compose restart

clean: down
	@docker rmi transcendence-django
	yes | docker system prune

reset: clean build

test: test_backend test_frontend

test_backend:
	@docker exec -it django python manage.py test db
	@docker exec -it django python backend_tests/test_endpoints.py

test_mini:
	@docker exec -it django python backend_tests/mini_test.py
	
test_frontend:
	@node srcs/tester/seleniumTest.js



ps:
	@docker compose ps

waflog:
	@docker exec -it nginx cat /var/log/modsec_audit.log
logs:
	@docker logs -f django

lognginx:
	@docker logs -f nginx

logdjango:
	@docker logs -f django

ifeq ($(shell uname -s), Linux)
	RMCOMMAND		= sudo rm -rf data
else
	RMCOMMAND		= rm -rf data
endif

fclean: down
	$(RMCOMMAND)
	docker rmi -f transcendence-django
	docker rmi -f transcendence-postgres
	docker rmi -f transcendence-nginx
	docker rmi -f transcendence-vault
	yes | docker system prune
	yes | docker volume prune

fresh: fclean build

.PHONY: help up down build rebuild restart clean reset fclean fresh ps
