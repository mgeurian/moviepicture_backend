'use strict';

const request = require('supertest');

const app = require('../app');
const UserMovie = require('../models/user-movie');
const db = require('../db');
const { createToken } = require('../helpers/tokens');

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

let user;
let user1Token;
let movie;
let tempUserMovie;

beforeAll(async () => {
	await commonBeforeAll();
	const result = await db.query('SELECT * FROM users WHERE email = $1', [ 'u1@example.com' ]);
	user = result.rows[0];
	user1Token = createToken({ email: 'u1@example.com', id: user.id });
	const movieResult = await db.query('SELECT * FROM movie where imdb_id = $1', [ 'tt3420504' ]);
	movie = movieResult.rows[0];

	const data = {
		userId: user.id,
		movieId: movie.id,
		viewed: true
	};

	tempUserMovie = await UserMovie.addMovieToUserList(data);
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/********************* GET /user/:id/account */
describe('GET /user/:id/account', function() {
	test('works for same user', async function() {
		const res = await request(app).get(`/user/${user.id}/account`).set('authorization', `Bearer ${user1Token}`);
		expect(res.body).toEqual({
			data: {
				id: user.id,
				first_name: 'U1F',
				last_name: 'U1L',
				email: 'u1@example.com',
				is_public: false
			}
		});
	});
});

/********************* PATCH /user/:id/account */

describe('PATCH, /user/:id/account', function() {
	test('works for same user', async function() {
		const res = await request(app)
			.patch(`/user/${user.id}/account`)
			.send({
				first_name: 'nameChanged'
			})
			.set('authorization', `Bearer ${user1Token}`);
		expect((res) => {
			res.body.data[0].first_name = 'nameChanged';
		});
	});
});

/********************* POST /user/:id/movie/:imdbId/add */

describe('POST /user/:id/movie/:imdbId/add', function() {
	test('adds a movie', async function() {
		const res = await request(app)
			.post(`/user/${user.id}/movie/tt0076759/add`)
			.set('authorization', `Bearer ${user1Token}`);
		expect(res.statusCode).toEqual(200);
	});
});

/********************* GET /user/:userId/movies/:type */

describe('GET, /user/:userId/movies/:type', function() {
	test('works for same user', async function() {
		const res = await request(app).get(`/user/${user.id}/movies/all`).set('authorization', `Bearer ${user1Token}`);
		expect(res.statusCode).toEqual(200);
	});
});

/********************* DELETE /user/:id/movie/:movieId */

describe('DELETE, /user/:userId/movie/movie_id', function() {
	test('works for same user', async function() {
		const res = await request(app)
			.delete(`/user/${user.id}/movie/${tempUserMovie.movie_id}`)
			.set('authorization', `Bearer ${user1Token}`);
		expect(res.statusCode).toEqual(200);
	});
});
