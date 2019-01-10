# :rocket: PowerCms - Auth service

[![Build Status](https://travis-ci.com/power-cms/auth-service.svg?branch=master)](https://travis-ci.com/power-cms/auth-service)
[![Coverage Status](https://coveralls.io/repos/github/power-cms/auth-service/badge.svg)](https://coveralls.io/github/power-cms/auth-service)

## How to install?

```bash
npm install --save @power-cms/auth-service
```

## Actions

| Name          | Public | Authorization |
|---------------|:------:|:-------------:|
| login         | Yes    | None          |
| refresh_token | Yes    | None          |
| register      | Yes    | None          |
| authenticate  | No     | None          |
| authorize     | No     | None          |

## Required services

None

## Environment variables

`ACCESS_TOKEN_SECRET` - Secret key for access token signing\
`REFRESH_TOKEN_SECRET` - Secret key for refresh token signing

## How to test?

```bash
npm test
```

## License

Copyright &copy; 2018 by Szymon Piecuch under ISC license.
