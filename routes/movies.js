'use strict';

/** Routes for movies. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureLoggedIn } = require('../middleware/auth');
const movieSearchSchema = require('../schemas/movieSearch.json');
const { BadRequestError, NotFoundError } = require('../expressError');
const Movie = require('../models/movie');
const UserMovie = require('../models/user-movie');
const OmdbWrapper = require('../helpers/omdb');

const router = express.Router();

/** GET /[searchTerm] => { movies }
 *
 * Returns { Poster, Title, Type, Year, imdbID }
 *
 *  **/
router.get('/search', ensureLoggedIn, async (req, res, next) => {
	try {
		const validator = jsonschema.validate(req.query, movieSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const data = await OmdbWrapper.searchMoviesByTitle(req.query.q, req.query.page);
		return res.json({ data });
	} catch (err) {
		return next(err);
	}
});

/** GET /[movie_id] => { movie }
 *
 * Returns { id, imdb_id, title, year, genre, plot, director, poster, imdb_rating }
 *
 *  **/

router.get('/:id', ensureLoggedIn, async function(req, res, next) {
	try {
		const { id } = req.params;
		const movie = await Movie.getById(id);

		if (!movie) {
			throw new NotFoundError(`Movie with id ${id} not found`);
		}

		return res.json({ data: movie });
	} catch (err) {
		return next(err);
	}
});

/** GET /[imdb_id] => { movie }
 *
 * Returns { Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot Language, Country Awards, Poster, Ratings[], Metascore
 * imdbRating, imdbVotes, imdbID, Type, DVD, BoxOffice, Production, Website, Response }
 *
 *  **/

router.get('/id/:id', ensureLoggedIn, async function(req, res, next) {
	try {
		const { id } = req.params;

		const { userId } = req.body;

		console.log(`this is the userId: ${userId}`);

		const viewed = await UserMovie.getViewedByImdbId(userId, id);

		console.log('this is viewed from movies routes: ', viewed);

		if (!viewed) {
			throw new BadRequestError(`Something went wrong.`);
		}
		const movie = await OmdbWrapper.getMovieByImdbId(id);

		if (!movie) {
			throw new NotFoundError(`Movie with imdbID ${id} not found`);
		}

		return res.json({ data: movie, viewedData: viewed });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
