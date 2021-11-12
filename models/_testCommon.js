const bcrypt = require('bcrypt');

const db = require('../db.js');
const { BCRYPT_WORK_FACTOR } = require('../config');

async function commonBeforeAll() {
	//noinspection SqlWithoutWhere
	await db.query('DELETE FROM movie');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');

	await db.query(`
        INSERT INTO movie (imdb_id, title, year, genre, plot, director, poster, imdb_rating)
        VALUES ('tt0076759', 'Star Wars', 1977,'Action, Adventure, Fantasy', "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vad", 'George Lucas', 'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 8.6)`);

	await db.query(
		`
        INSERT INTO users(password, 
                          first_name, 
                          last_name, 
                          email, 
                          is_public)
        VALUES ($1,'Test','User','testuser@example.com',FALSE)
        RETURNING id`,
		[ await bcrypt.hash('password', BCRYPT_WORK_FACTOR) ]
	);

	await db.query(`
        INSERT INTO user_movie (user_id, movie_id, viewed)
        VALUES (1, 1, TRUE)`);
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

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll
};
