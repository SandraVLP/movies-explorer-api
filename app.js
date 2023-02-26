const express = require('express');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
require('dotenv').config();
// const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { celebrate, Joi } = require('celebrate');

const app = express();
const { errors } = require('celebrate');
// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const {
//   login, createUser,
// } = require('./controllers/user');

// const NotFoundError = require('./errors/not-found-err');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

// const options = {
//   origin: ['https://aleksanvp.nomoredomains.work',
//     'http://aleksanvp.nomoredomains.work',
//     'localhost:3000',
//   ],
//   methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Content-type', 'origin', 'Authorization'],
//   credentials: true,
// };

// app.use('*', cors(options));

app.use('/', require('./routes/index'));

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), login);
// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//     name: Joi.string().required().min(2).max(30),
//   }),
// }), createUser);

// app.use('*', auth, (req, res, next) => {
//   next(new NotFoundError('Страница по указанному маршруту не найдена'));
// });

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate
app.use((err, req, res, next) => {
  console.log('err', err);
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});