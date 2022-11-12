# Cohort Manager

This app is deployed at [https://cohortmanager.netlify.app](https://cohortmanager.netlify.app)

A web-based learning management system where teachers and admins can manage courses and users while allowing interactions among students and teachers by implementing a post area.

## Table of contents

- [Cohort Manager](#cohort-manager)
  - [Table of contents](#table-of-contents)
  - [General info](#general-info)
  - [Technologies](#technologies)
  - [Run this project locally](#run-this-project-locally)

## General info

This is the client repository for Cohort Manager. You can find the client repository [here](https://github.com/ning905/team-dev-client-c6).

This project is built for the Boolean Course as the team development project.

## Technologies

Project is created with:

JavaScript, NodeJS, Express, Postgres, Prisma, JSON Web Token, bcrypt

## Run this project locally

1. Fork this repository and clone the fork to your machine.
2. Copy `.env.example` and name it `.env`
3. Create a postgres database and add its URL into the `DATABASE_URL` environment variable, keeping `?schema=prisma` on the end
   - Postgres db URLs are in the format: `postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]`
   - Note that prisma doesn't store data in the public schema, so set the search path to prisma in your db client. For PSQL client
   - use `\dn` to show available schemas
   - use SQL to set the search path to the correct schema: `SET search_path to prisma;`
   - `\dt` will then show available tables (once migrations have been run)
4. If using a cloud database provider:
   - Create another database and run `create schema shadow` on it
   - Add its URL into the `SHADOW_DATABASE_URL` env var, keeping `?schema=shadow` on the end
5. `npm ci` to install dependencies
6. `npx prisma migrate reset` to apply migrations to your db
7. `npm run dev` to run the app
8. Fork the [client repository](https://github.com/ning905/team-dev-client-c6) and follow the instructions.
