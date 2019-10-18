DUVIDAS
- como adicionar imagem ao email ?
- como fazer do calculo do price/end_date unico ?
- o que acontece com os campos extras (nao necessarios) enviados para um update ?


<h1 align="center">
  <img alt="Gympoint" title="Gympoint" src="logo.png" width="200px" />
</h1>

<h3 align="center">
  Workout Gym App management
</h3>

## :rocket: About the project

### Tools

[Node.js](https://nodejs.org/)    |     [Express](https://expressjs.com/)

This project also comes with the following features configured:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgreSQL);

### Functionalities

#### 1. Authentication

- [x] User Authenticate using e-mail and password - returns a JWT Token
- [x] Create Admin user using [sequelize seeds](https://sequelize.org/master/manual/migrations.html#creating-first-seed)
- [x] Validate Models using Yup

To execute the provided seed `src/database/seeds`, use the command bellow:

```js
yarn sequelize db:seed:all
```

#### 2. Students

Students Model

```js
{ name, email, birth, weight, height }
```

Students can only be registered by authenticated `Users`.

### Admin functionalities

#### 1. Plans management

Allows users with Admin role to create and maintain Monlty Workout Plan to attract more customers.

`Plans` Database Schema example:

- title (name of the package);
- duration (time in months);
- price (price per month);
- created_at;
- updated_at;

`Plans` API Routes:

- List all plans;
- Create new plans;
- Update a plan;
- Delete a plan;

The following Plans are seeded by default:

- `Start`: 1-Month plan $129;
- `Gold`: 3-Months plan $109;
- `Diamond`: 6-Months plan $89;

Obs.: This functionality is only available for authenticated users with Admin rights.

#### 2. Enrollment Management

Although the `student` is registered on the platform, this does not mean that the `student` has an active registration and can access the gym.

`Enrollments` Database Schema example:

- student_id
- plan_id
- start_date
- end_date
- price (total price calculated at the enrollment);
- created_at;
- updated_at;

The **start_date** must be informed by the user;

The **end_date** and **price** are calculated as the example bellow:

start_date: `23/05/2019`
plan_id: `Gold (3-Months)`
end_date (calculated): `23/08/2019 (3 months after the start_date)`
price (calculated): `$327`

After a student enrolls, an email should be sent containing all details about the enrollment, like selected plan, starting and ending dates, price and a welcome message.

`Enrollments` API Routes:

- List all enrollments;
- Create new enrollment;
- Update a enrollment;
- Delete a enrollment;


Obs.: This functionality is only available for authenticated users with Admin rights.

### Student Features

#### 1. Checkins

When the student arrives at the gym, he / she performs a check-in only informing his / her registration ID (database ID);

This check-in serves to monitor how many times the user has attended the gym during the week.

`Checkins` Database Schema example:

- student_id;
- created_at;
- updated_at;

A student can only have **5 checkins** within 7 calendar days.

Exemplo de requisição: `POST https://gympoint.com/students/3/checkins`

Crie uma rota para listagem de todos checkins realizados por um usuário com base em seu ID de cadastro;

Exemplo de requisição: `GET https://gympoint.com/students/3/checkins`

#### 2. Pedidos de auxílio

O aluno pode criar pedidos de auxílio para a academia em relação a algum exercício, alimentação ou instrução qualquer;

A tabela `help_orders` deve conter os seguintes campos:

- student_id (referência ao aluno);
- question (pergunta do aluno em texto);
- answer (resposta da academia em texto);
- answer_at (data da resposta da academia);
- created_at;
- updated_at;

Crie uma rota para a academia listar todos pedidos de auxílio sem resposta;

Crie uma rota para o aluno cadastrar pedidos de auxílio apenas informando seu ID de cadastro (ID do banco de dados);

Exemplo de requisição: `POST https://gympoint.com/students/3/help-orders`

Crie uma rota para listar todos pedidos de auxílio de um usuário com base em seu ID de cadastro;

Exemplo de requisição: `GET https://gympoint.com/students/3/help-orders`

Crie uma rota para a academia responder um pedido de auxílio:

Exemplo de requisição: `POST https://gympoint.com/help-orders/1/answer`

Quando um pedido de auxílio for respondido, o aluno deve receber um e-mail da plataforma com a pergunta e resposta da academia;

---
## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a href="https://github.com/devrdias/" target="_blank">devrdias</a>.
