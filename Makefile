app-start:
	@echo -e "\n\tAPP LAUNCH 🚀\n"
	@docker-compose up --build --force-recreate --remove-orphans

api-dev-clean:
	@echo -e "\n\tCLEAN 🗑️\n"
	@docker-compose down --remove-orphans
