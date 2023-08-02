## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript repository seed.

### Features

- Global Error handling using ExceptionFilter
- Consistent response data using Interceptor
- 2 types of authentication mechanism: JWT using local strategy and oauth2 using github strategy
- Offset pagination using skip and take as query implemented
- API documentation using Swagger
- Caching using Redis
- Logger Implementation using Logger from @nestjs/common
- Prisma Integration with Postgresql database

## Installation

```bash
$ yarn install
```

## Set Env File

Make sure you have a .env file in the root directory of the project. The .env file should contain the variable as mentioned in .env.example.
For database url use the following format(if using docker for the process):
DATABASE_URL="postgres://myuser:mypassword@localhost:5432/median-db"

## Running the app

Make sure docker is running on your machine.

```bash
# database and redis setup
$ docker-compose up -d

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

Go to http://localhost:3000/documentation to view the swagger documentation.

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
