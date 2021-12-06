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
		const { user_id } = req.query;

		//get IMDB_id and search user's list (by userId) for a specific movie wth id of (id)
		const viewed = await UserMovie.getViewedByImdbId(user_id, id);

		let viewedResults = viewed;
		console.log('these are the viewedResults: ', viewedResults);

		// if there are no results, the movie is not in the user's list.
		// return the imdb_id and set viewed to false to show the user has not seen the movie.
		if (!viewedResults) {
			viewedResults = {
				imdb_id: id,
				viewed: false
			};
		}

		const movie = await OmdbWrapper.getMovieByImdbId(id);

		if (!movie) {
			throw new NotFoundError(`Movie with imdbID ${id} not found`);
		}

		return res.json({ data: movie, viewedResults: viewedResults });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
