'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');
const express = require('express');
const { ensureCorrectUser, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError, UnauthorizedError } = require('../expressError');
const User = require('../models/user');
const Movie = require('../models/movie');
const UserMovie = require('../models/user-movie');
const OmdbWrapper = require('../helpers/omdb');
const userUpdateSchema = require('../schemas/userUpdate.json');
const userMovieUpdate = require('../schemas/userMovieUpdate.json');

const router = express.Router();

/** GET /[id] => { user }
 *
 * Returns { id, firstName, lastName, email }
 *
 * Authorization required: same user-as-:id
 **/

router.get('/:id/account', ensureLoggedIn, async function(req, res, next) {
	try {
		const { id } = req.params;
		const user = await User.get(id);

		if (res.locals.user.id != id && !user.is_public) {
			throw new UnauthorizedError();
		}

		return res.json({ data: user });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, email }
 *
 * Returns { id, firstName, lastName, email }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch('/:id/account', ensureCorrectUser, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const user = await User.update(req.params.id, req.body);
		return res.json({ data: user });
	} catch (err) {
		return next(err);
	}
});

router.post('/:id/movie/:imdbId/add', ensureCorrectUser, async (req, res, next) => {
	const { imdbId, id } = req.params;
	const { viewed = true } = req.body;

	try {
		// Check if movie already exists in db
		let movieRes = await Movie.getByImdbId(imdbId);

		// If it doesn't, then add it to movie table
		if (!movieRes) {
			const movieData = await OmdbWrapper.getMovieByImdbId(imdbId);

			if (movieData.Error || movieData.Response === 'False') {
				throw new BadRequestError(`Invalid imdbId ${imdbId}`);
			}

			movieRes = await Movie.create(movieData);
		}

		// Check if user has already added the movie
		const userMovieRecord = await UserMovie.getByUserIdAndMovieId(id, movieRes.id);

		if (userMovieRecord) {
			// Maybe add a unique index?
			throw new BadRequestError(`User has already added this movie by id ${movieRes.id}`);
		}

		const data = {
			userId: res.locals.user.id,
			movieId: movieRes.id,
			viewed
		};

		const responseData = await UserMovie.addMovieToUserList(data);
		return res.json({ data: responseData });
	} catch (err) {
		return next(err);
	}
});

router.get('/:userId/movies/:type', ensureLoggedIn, async (req, res, next) => {
	try {
		const { userId, type = 'all' } = req.params;
		const { page = 1 } = req.query;
		const { id: loggedInUserId } = res.locals.user;

		const user = await User.get(userId);

		if (loggedInUserId != userId && !user.is_public) {
			throw new UnauthorizedError('Cannot view private movie list');
		}

		/**
         * If querying another user's public list, use this complicated query.
         * It indicates whether each of their movies is also included on logged in user's list.
         */
		if (loggedInUserId != userId) {
			const movies = await UserMovie.getMappedMovieList(userId, loggedInUserId, page, type);
			return res.json({ data: movies });
		}

		// Otherwise use this easier query for my list of movies
		const movies = await UserMovie.getUserMovies(userId, page, type);
		return res.json({ data: movies });
	} catch (err) {
		return next(err);
	}
});

router.patch('/:id/movie/:userMovieId/update', ensureCorrectUser, async (req, res, next) => {
	try {
		const validator = jsonschema.validate(req.body, userMovieUpdate);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const { viewed } = req.body;
		const { userMovieId } = req.params;
		const { id: userId } = res.locals.user;

		const updatedMovie = await UserMovie.updateUserMovie({ viewed, userMovieId, userId });
		return res.json({ data: updatedMovie });
	} catch (err) {
		return next(err);
	}
});

router.delete('/:id/movie/:userMovieId', ensureCorrectUser, async (req, res, next) => {
	const { id: userId, userMovieId } = req.params;
	try {
		const result = await UserMovie.deleteUserMovie({ userMovieId, userId });
		return res.json({ data: result });
	} catch (err) {
		return next(err);
	}
});

router.get('/search', ensureLoggedIn, async (req, res, next) => {
	try {
		const { q = '' } = req.query;
		const userEmail = decodeURIComponent(q).toLowerCase();
		const user = await User.getPublicUserByEmail(userEmail);

		return res.json({ data: user });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
