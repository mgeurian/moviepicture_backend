'use strict';

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

/** Related functions for a user's movies. */

class UserMovie {
    static viewTypeProperties = {
        all: 'true OR false',
        viewed: 'true',
        notViewed: 'false'
    }

    static async getByUserIdAndMovieId(userId, movieId) {
        const movieRes = await db.query(
            `SELECT *
            FROM user_movie
            WHERE user_id = $1 AND movie_id = $2`,
            [userId, movieId]
        );

        const [userMovie] = movieRes.rows;
        return userMovie;
    }

    static async addMovieToUserList(data) {
        const { userId, movieId, viewed } = data;

        const result = await db.query(
            `INSERT INTO user_movie
            (user_id,
            movie_id,
            viewed)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, movie_id, viewed`,
            [userId, movieId, viewed]
        );

        const [userMovie] = result.rows;

        return userMovie;
    }

    static async getUserMovies(id, page, type) {
        const offset = (page - 1) * 20;

        const result = await db.query(
            `SELECT um.id, um.movie_id, um.viewed, m.title, m.poster, m.imdb_id
            FROM user_movie um
            INNER JOIN movie m ON um.movie_id = m.id
            WHERE um.user_id = $1 AND um.viewed IS ${ UserMovie.viewTypeProperties[type] }
            ORDER BY title ASC
            LIMIT 20 OFFSET $2`,
            [id, offset]
        );

        const userMovies = result.rows;

        return userMovies;
    }

    // queries other user's list, but let's me know which of their movies is also in my list
    static async getMappedMovieList(userId, loggedInUserId, page, type) {
        const offset = (page - 1) * 20;

        const result = await db.query(
            `SELECT um.id, um.movie_id, um.viewed, m.title, m.poster, m.imdb_id,
            CASE
	            WHEN COUNT(um.id) = 2 THEN true
	            WHEN COUNT(um.id) = 1 THEN false
            END included_in_your_list
        FROM user_movie um
        LEFT JOIN (
            SELECT *
            FROM user_movie
            WHERE user_id IN ($1, $2)
        ) sub
        ON um.movie_id = sub.movie_id
        INNER JOIN movie m ON um.movie_id = m.id
        WHERE um.user_id = $1 AND um.viewed IS ${ UserMovie.viewTypeProperties[type] }
        GROUP BY um.id, um.movie_id, um.viewed, m.title, m.poster, m.imdb_id
        ORDER BY m.title ASC
        LIMIT 20 OFFSET $3`,
            [userId, loggedInUserId, offset]
        );

        return result.rows;
    }

    static async updateUserMovie({ userMovieId, viewed, userId }) {
        const result = await db.query(`
            UPDATE user_movie
            SET viewed = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 AND user_id = $3
            RETURNING id, user_id, movie_id, viewed, created_at, updated_at
        `, [viewed, userMovieId, userId]);

        const [userMovie] = result.rows;

        if (!userMovie) {
            throw new NotFoundError(`UserMovie id ${ userMovieId } not found`);
        }

        return userMovie;
    }

    static async deleteUserMovie({ userMovieId, userId }) {
        const result = await db.query(`
            DELETE FROM user_movie
            WHERE id = $1 AND user_id = $2`, [userMovieId, userId]);

        if (result.rowCount === 0) {
            throw new NotFoundError(`UserMovie id ${ userMovieId } not found`);
        }

        return { success: true };
    }
}

module.exports = UserMovie;
