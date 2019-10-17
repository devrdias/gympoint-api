<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src="logo.png" width="200px" />
</h1>

<h3 align="center">
  Workout Gym App management
</h3>


## :rocket: About the project

### Tools

[Node.js](https://nodejs.org/) [Express](https://expressjs.com/)

This project also comes with the following features configured:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (Utilize PostgreSQL ou MySQL);

### Functionalities

#### 1. Authentication

- [x] User Authenticate using e-mail and password
- [x] Create Admin user using [sequelize seeds](https://sequelize.org/master/manual/migrations.html#creating-first-seed)
- [ ] A autenticação deve ser feita utilizando JWT.
- [ ] Realize a validação dos dados de entrada;

To execute the provided seed `src/database/seeds`, use the command bellow:

```js
yarn sequelize db:seed:all
```

#### 2. Students register

Students Model
```json
{ name, email, birth, weight, height }
```

Students can only be registered by authenticated `Users`.

---
## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a href="http://fvcproductions.com" target="_blank">devrdias</a>.
