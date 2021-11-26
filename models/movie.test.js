'use strict';

const db = require('../db.js');
const { BadRequestError, NotFoundError } = require('../expressError');
const Movie = require('./movie');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	testUserIds,
	testMovieIds
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function() {
	const newMovie = {
		imdbID: 'tt3420504',
		Title: 'Finch',
		Year: 2021,
		Genre: 'Drama, Sci-Fi',
		Plot:
			"On a post-apocalyptic earth, a robot, built to protect the life of his creator's beloved dog, learns about life, love, friendship and what it means to be human.",
		Director: 'Miguel Sapochnik',
		Poster:
			'https://m.media-amazon.com/images/M/MV5BMmExZDc4NjEtZjY1ZS00OWU5LWExZGYtYTc4NDM1ZmRhMDZhXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg',
		imdbRating: 7.0
	};

	test('create new movie works', async function() {
		let movie = await Movie.create(newMovie);
		expect(movie).toEqual(newMovie);

		const result = await db.query(
			`SELECT imdb_id, title, year, genre, plot, director, poster, imdb_rating FROM movie WHERE imdb_id = 'tt3420504'`
		);
		expect(result.rows).toEqual([
			{
				imdb_id: 'tt3420504',
				title: 'Finch',
				year: 2021,
				genre: 'Drama, Sci-Fi',
				plot:
					"On a post-apocalyptic earth, a robot, built to protect the life of his creator's beloved dog, learns about life, love, friendship and what it means to be human.",
				director: 'Miguel Sapochnik',
				poster:
					'https://m.media-amazon.com/images/M/MV5BMmExZDc4NjEtZjY1ZS00OWU5LWExZGYtYTc4NDM1ZmRhMDZhXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg',
				imdb_rating: 7.0
			}
		]);
	});
});

/************************************** getAll */

// describe
