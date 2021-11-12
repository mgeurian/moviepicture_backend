'use strict';

process.env.NODE_ENV = 'test';

const db = require('../db');
const User = require('../models/user');
const Movie = require('../models/movie');
const UserMovie = require('../models/user-movie');
const { createToken } = require('../helpers/tokens');
const { omdbWrapper } = require('../helpers/omdb');
const { disable } = require('../app');

async function commonBeforeAll() {
	// noInspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	// noInspection SqlWithoutWhere
	await db.query('DELETE FROM movie');

	await Movie.create({
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
	});

	await User.register({
		password: 'password',
		first_name: 'U1F',
		last_name: 'U1L',
		email: 'u1@example.com',
		is_public: 'false'
	});
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

const user1Token = createToken({ email: 'u1@example.com', password: 'password' });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	user1Token
};
