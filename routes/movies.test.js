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

// /************************************** GET /search */

describe('GET /search', function() {
	test('works for user', async function() {
		const res = await request(app).get(`/movie/search`).set('authorization', `Bearer ${user1Token}`);
		expect;
	});
});

// /************************************** GET /:id */

describe('GET /:id', function() {
	test('works for user', async function() {
		const res = await request(app).get(`/movie/${movie.id}`).set('authorization', `Bearer ${user1Token}`);
		expect(res.statusCode).toEqual(200);
	});
});

// /************************************** GET /id/:id */

describe('GET, /id/:id', function() {
	test('works for user', async function() {
		const res = await request(app).get(`/movie/id/${movie.id}`).set('authorization', `Bearer ${user1Token}`);
		expect(res.statusCode).toEqual(200);
	});
});
