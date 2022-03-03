# BookMark App

Dockerized simple web app template with Angular + NestJS + MongoDB.

## Features

- [Angular 13.x](https://angular.io/) 
- [NestJS](https://nestjs.com/) Server
- [Mongoose ODM](https://mongoosejs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [MongoDB](https://www.mongodb.com/)
- Authentication w/ [JWT](https://jwt.io/) and [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Docker](https://www.docker.com/) Compose


# Installation

1. Clone the repo
```sh
git clone https://github.com/AoussarElMehdi/mean-auth-bookmark-app-using-docker.git
```
2. Install NPM packages
```sh
cd client && npm install
cd server && npm install
```

# Getting Started

## Client

<p align="center">
  <a href="https://angular.io/" target="blank"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="320" alt="Angular Logo" /></a>
</p>

In the project directory, you can run:
### `ng serve`

Runs the app in the development mode.\
Open `http://localhost:4200/` to view it in your browser.

The app will automatically reload if you change any of the source files.

### `ng test`

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


### `ng Build`


Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


### `ng test`


Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


### `ng e2e`


Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Server

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
