'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUser } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();

/** GET /[id] => { user }
 *
 * Returns { id, firstName, lastName, email }
 *
 * Authorization required: same user-as-:id
 **/

router.get('/:id', ensureCorrectUser, async function(req, res, next) {
	try {
		const user = await User.get(req.params.id);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, email }
 *
 * Returns { id, firstName, lastName, email }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch('/:id', ensureCorrectUser, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const user = await User.update(req.params.id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
