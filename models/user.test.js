'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const User = require('./user.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testJobIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe('authenticate', function() {
	test('works', async function() {
		const user = await User.authenticate('u1@example.com', 'password');
		expect(user).toEqual({
			password: 'password',
			first_name: 'Test',
			last_name: 'User1',
			email: 'u1@example.com',
			is_public: false
		});
	});

	test('unauth if no such user', async function() {
		try {
			await User.authenticate('nope', 'password');
			fail();
		} catch (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		}
	});

	test('unauth if wrong password', async function() {
		try {
			await User.authenticate('c1', 'wrong');
			fail();
		} catch (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		}
	});
});

/************************************** register */

describe('register', function() {
	const newUser = {
		first_name: 'new',
		last_name: 'User3',
		email: 'u3@example.com',
		is_public: false
	};

	test('works', async function() {
		let user = await User.register({
			...newUser,
			password: 'password'
		});
		expect(user).toEqual(newUser);
		const found = await db.query("SELECT * FROM users WHERE first_name = 'new'");
		expect(found.rows.length).toEqual(1);
		expect(found.rows[0].is_public).toEqual(false);
	});

	test('bad request with dup data', async function() {
		try {
			await User.register({
				...newUser,
				password: 'password'
			});
			await User.register({
				...newUser,
				password: 'password'
			});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/************************************** get */

describe('get', function() {
	test('works', async function() {
		let user = await User.get('u1@example.com');
		expect(user).toEqual({
			first_name: 'Test',
			last_name: 'User1',
			email: 'u1@example.com',
			is_public: false
		});
	});

	test('not found if no such user', async function() {
		try {
			await User.get('nope');
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** update */

describe('update', function() {
	const updateData = {
		first_name: 'NewF',
		last_name: 'NewF',
		email: 'new@email.com',
		isAdmin: true
	};

	test('works', async function() {
		let job = await User.update('u1@example.com', updateData);
		expect(job).toEqual({
			username: 'u1',
			...updateData
		});
	});

	test('works: set password', async function() {
		let job = await User.update('u1@example.com', {
			password: 'new'
		});
		expect(job).toEqual({
			firstName: 'U1F',
			lastName: 'U1L',
			email: 'u1@email.com',
			isAdmin: false
		});
		const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
		expect(found.rows.length).toEqual(1);
		expect(found.rows[0].password.startsWith('$2b$')).toEqual(true);
	});

	test('not found if no such user', async function() {
		try {
			await User.update('nope', {
				firstName: 'test'
			});
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('bad request if no data', async function() {
		expect.assertions(1);
		try {
			await User.update('c1', {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/************************************** remove */

describe('remove', function() {
	test('works', async function() {
		await User.remove('u1');
		const res = await db.query("SELECT * FROM users WHERE username='u1'");
		expect(res.rows.length).toEqual(0);
	});

	test('not found if no such user', async function() {
		try {
			await User.remove('nope');
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** applyToJob */

describe('applyToJob', function() {
	test('works', async function() {
		await User.applyToJob('u1', testJobIds[1]);

		const res = await db.query('SELECT * FROM applications WHERE job_id=$1', [ testJobIds[1] ]);
		expect(res.rows).toEqual([
			{
				job_id: testJobIds[1],
				username: 'u1'
			}
		]);
	});

	test('not found if no such job', async function() {
		try {
			await User.applyToJob('u1', 0, 'applied');
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('not found if no such user', async function() {
		try {
			await User.applyToJob('nope', testJobIds[0], 'applied');
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
