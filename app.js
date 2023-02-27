const express = require('express');
// Слушаем 3000 порт
require('dotenv').config();

const { PORT, MONGO_BASE } = process.env;

const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { celebrate, Joi } = require('celebrate');

const app = express();

const helmet = require('helmet');

const { errors } = require('celebrate');
// const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errHandler = require('./middlewares/err-handler');
const { limiter } = require('./middlewares/limiter');
// const {
//   login, createUser,
// } = require('./controllers/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(MONGO_BASE);

// подключаем rate-limiter
app.use(limiter);

app.use(requestLogger);

const options = {
  origin: ['https://api.aleksmovie.nomoredomains.work',
    'http://api.aleksmovie.nomoredomains.work',
    'localhost:3000',
  ],
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
