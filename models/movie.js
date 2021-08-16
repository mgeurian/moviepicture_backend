'use strict';

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

/** Related functions for movies. */

class Movie {
	static async create({}) {}

	static async findAll(searchFilters = {}) {}

	static async get(id) {}

	static async update(id, data) {}

	static async remove(id) {}
}

module.exports = Movie;
