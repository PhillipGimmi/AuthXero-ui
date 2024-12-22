find . -type d \( -path '_/node_modules' -o -path '_/.next' -o -path '_/dist' -o -path '_/build' -o -path '\*/.git' \) -prune -o -type f -print
find . -path ./node_modules -prune -o -path ./.git -prune -o -path ./dist -prune -o -type f -print

docker-compose down -v # Stop containers and remove volumes
docker-compose up --build # Rebuild and start containers

docker exec -it my-app-db-1 psql -U postgres -d myapp
