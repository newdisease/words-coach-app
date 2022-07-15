## Getting Started

1. clone the repository
2. config your .env file (see .env.example)
3. run `docker-compose up -d`

## Fast create superuser 

run `docker-compose exec backend python manage.py initadmin`

- login: `admin`
- password: `admin`

## Fast create test data

run `docker-compose exec backend python manage.py createdata`