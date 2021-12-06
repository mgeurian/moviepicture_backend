'use strict';

const db = require('../db.js');
const Movie = require('./movie');
const UserMovie = require('./user-movie');
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	testMovieIds,
	testUserIds
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getByUserIdAndMovieId */

describe('get', function() {
	test('works', async function() {
		let movie = await UserMovie.getByUserIdAndMovieId(testUserIds[0], testMovieIds[0]);
		expect(movie.movie_id).toEqual(testMovieIds[0]);
	});
});

/************************************** addMovieToUserList */

describe('add a movie to a User List', function() {
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

	test('works', async function() {
		const newMovieId = await Movie.create(newMovie);

		const data = {
			userId: testUserIds[0],
			movieId: newMovieId.id
		};

		let movie = await UserMovie.addMovieToUserList(data);
		expect(movie.movie_id).toEqual(newMovieId.id);
	});
});

/************************************** getUserMovies */
/* need to mock static variables for this one */

describe('get a list of users movies', function() {
	test('works', async function() {
		let movieList = await UserMovie.getUserMovies(testUserIds[0], 1, 'all');
		expect(movieList.length).toEqual(1);
	});
});

/************************************** getTotalNumberOfMovies */

describe('get the total number of movies in a users list', function() {
	test('works', async function() {
		const movieNum = await UserMovie.getTotalNumberOfMovies(testUserIds[0]);
		expect(parseInt(movieNum.count)).toEqual(1);
	});
});

/************************************** deleteUserMovie */

describe('delete a movie from the users list', function() {
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

	test('works', async function() {
		const newMovieId = await Movie.create(newMovie);
		const data = {
			userId: testUserIds[0],
			movieId: newMovieId.id
		};

		let movie = await UserMovie.addMovieToUserList(data);
		expect(movie.user_id).toEqual(data.userId);

		const deletedMovie = await UserMovie.deleteUserMovie({ movieId: movie.movie_id, userId: testUserIds[0] });
		expect(deletedMovie.success).toBeTruthy();
	});
});

/************************************** getViewedByImdbId */

describe('get viewed movie during search', function() {
	const newMovie = {
		imdbID: 'tt3420504'
	};

	test('works when movie is NOT in user list', async function() {
		const viewed = await UserMovie.getViewedByImdbId(testUserIds[0], newMovie.imdbID);
		expect(viewed).toEqual(undefined);
	});

	test('works wen movie IS in user list', async function() {
		const starwarsImdbID = 'tt0076759';
		const viewed = await UserMovie.getViewedByImdbId(testUserIds[0], starwarsImdbID);
		expect(viewed.viewed).toBeTruthy();
	});
});
