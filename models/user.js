// const validator = require('validator');
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
