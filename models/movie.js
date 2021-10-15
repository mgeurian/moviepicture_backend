'use strict';

const db = require('../db');

/** Related functions for movies. */

class Movie {
	static async create(data) {
		const { imdbID, Title, Year, Genre, Plot, Director, Poster, imdbRating } = data;
		const result = await db.query(
			`INSERT INTO movie
            (imdb_id,
            title,
            year,
            genre,
            plot,
            director,
            poster,
            imdb_rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`,
			[ imdbID, Title, Year, Genre, Plot, Director, Poster, imdbRating ]
		);

		const [ movie ] = result.rows;

		return movie;
	}

	static async getByImdbId(imdbId) {
		const movieRes = await db.query(
			`SELECT *
            FROM movie
            WHERE imdb_id = $1`,
			[ imdbId ]
		);

		const [ movie ] = movieRes.rows;
		return movie;
	}

	static async getById(id) {
		const movieRes = await db.query(
			`SELECT *
            FROM movie
            WHERE id = $1`,
			[ id ]
		);

		const [ movie ] = movieRes.rows;
		return movie;
	}
}

module.exports = Movie;
