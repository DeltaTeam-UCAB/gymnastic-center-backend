# Getting started with monorepo

## Description

Monorepo [TypeScript](https://www.typescriptlang.org/) starter with [Nest](https://github.com/nestjs/nest). The package manager is [pnpm](https://pnpm.io/). You need [NodeJs](https://nodejs.org/en/) >=20.11.0. For dependencies graph you need [Graphviz](https://graphviz.org/download/)

## node installation by nvm
```bash
# windows
$ nvm install $(Get-Content .nvmrc).replace( 'v', '' )

# bash
$ nvm install
```

## pnpm installation 
```bash
# enable corepack
$ corepack enable

# Or install pnpm by npm
$ npm install -g pnpm
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Lint
```bash
# run lint with eslint
$ pnpm lint
```

## Format
```bash
# format all with prettier
$ pnpm format
```

## Test

```bash
# unit tests
$ pnpm run test:unit

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

- Nest is [MIT licensed](LICENSE).
- [pnpm](https://github.com/pnpm/pnpm)



## Authors

- [@danixl30](https://github.com/danixl30)


![NestJs](https://res.cloudinary.com/practicaldev/image/fetch/s--m_Ng9MLF--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/fppjegg7q1kb2pdzmlvf.png)

![PNpm](https://d33wubrfki0l68.cloudfront.net/aad219b6c931cebb53121dcda794f6180d9e4397/c405b/es/assets/images/pnpm-standard-79c9dbb2e99b8525ae55174580061e1b.svg)

![TypeScript](https://blog.marksauerutley.com/static/d0050d0772fd9db5ec35f7b69a66b609/6af66/tslogo.png)
