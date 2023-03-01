const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send({ data: movies }))
    .catch((err) => {
      next(err);
    });
};

module.exports.postMovie = (req, res, next) => {
  Movie.create({
    ...req.body, owner: req.user._id,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movieToDelete = await Movie.findById(req.params._id);
    const currentUserId = req.user._id;
    if (movieToDelete == null) {
      next(new NotFoundError('Передан несуществующий _id фильма.'));
    } else if (currentUserId === movieToDelete.owner.toString()) {
      Movie.findByIdAndDelete(req.params._id)
        .then((movie) => res.status(200).send({ data: movie }))
        .catch(next);
    } else {
      next(new ForbiddenError('Нельзя удалять чужие фильмы.'));
    }
  } catch (err) {
    next(err);
  }
};
