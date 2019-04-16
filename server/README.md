# Exercice GraphQL

## Monter les volumes

docker run -e POSTGRES_USER=adeline -e POSTGRES_PASSWORD=adeline -p 3211:5432 -v ecommerce:/var/lib/postgresql/data -d postgres:latest

## Entrer dans le container

docker container exec -it a3fb7f95ffe4 bash

## Lancer la BD

psql -U adeline
