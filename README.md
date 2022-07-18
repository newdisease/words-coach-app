## Start the project in the development mode

1. clone the repository
2. config your .env file (see .env.example)
3. run `docker-compose up -d`

Quick creation of a superuser: `docker-compose exec backend python manage.py initadmin`

- login: `admin`
- password: `admin`

Quick creation of a test data `docker-compose exec backend python manage.py createdata`