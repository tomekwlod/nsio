dev:
	npm install
	sed -i -e 's/ENVMODE=.*/ENVMODE=dev/g' ./.env
	docker-compose up --build

start:
	npm install --quite
	sed -i -e 's/ENVMODE=.*/ENVMODE=prod/g' ./.env
	docker-compose up --build -d

stop:
	docker-compose down