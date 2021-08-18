'use strict';

/** Routes for movies. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const Movie = require('../models/movie');
const { createToken } = require('../helpers/tokens');

const router = express.Router();

/** GET /[movie_id] => { movie }
 *
 * Returns { id, imdb_id, title, year, genre, plot, director, poster, imdb_rating }
 *
 *  **/

router.get('/:id', async function(req, res, next) {
	try {
		const movie = await Movie.get(req.params.movie_id);
		return res.json({ movie });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
