'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

/** Related functions for users. */

class User {
	/** authenticate user with email, password.
   *
   * Returns { username, first_name, last_name, email }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

	static async authenticate(email, password) {
		// try to find the user first
		const result = await db.query(
			`SELECT id,
							password,
              first_name,
              last_name,
              email
          FROM users
          WHERE email = $1`,
			[ email ]
		);

		const user = result.rows[0];

		if (user) {
			// compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		throw new UnauthorizedError('Invalid email/password');
	}

	/** Register user with data.
   *
   * Returns { username, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/

	static async register({ password, first_name, last_name, email }) {
		const duplicateCheck = await db.query(
			`SELECT email
            FROM users
            WHERE email = $1`,
			[ email ]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate email: ${email}`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
            (password,
            first_name,
            last_name,
            email)
            VALUES ($1, $2, $3, $4)
            RETURNING first_name, last_name, email, id`,
			[ hashedPassword, first_name, last_name, email ]
		);

		const user = result.rows[0];

		return user;
	}

	/** Given an email, return data about user.
   *
   * Returns { email, first_name, last_name }
   *
   * Throws NotFoundError if user not found.
   **/

	static async get(id) {
		const userRes = await db.query(
			`SELECT id,
							email,
              first_name,
              last_name
            FROM users
            WHERE id = $1`,
			[ id ]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${id}`);

		return user;
	}

	/** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns { firstName, lastName, email }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

	static async update(id, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: 'first_name',
			lastName: 'last_name'
		});
		const emailVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE email = ${emailVarIdx} 
                      RETURNING id,
																first_name,
                                last_name,
                                email`;
		const result = await db.query(querySql, [ ...values, id ]);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${id}`);

		delete user.password;
		return user;
	}

	/** Delete given user from database; returns undefined. */

	static async remove(id) {
		let result = await db.query(
			`DELETE
            FROM users
            WHERE id = $1
            RETURNING email`,
			[ id ]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${id}`);
	}
}

module.exports = User;
