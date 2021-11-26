'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const User = require('./user.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testUserIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe('authenticate', function() {
	test('works', async function() {
		const user = await User.authenticate('testuser@example.com', 'password');
		expect(user).toEqual({
			id: testUserIds[0],
			first_name: 'Test',
			last_name: 'User1',
			email: 'testuser@example.com'
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
		email: 'u3@example.com'
	};

	test('works', async function() {
		let user = await User.register({
			...newUser,
			password: 'password'
		});

		expect(user.first_name).toEqual(newUser.first_name);

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
		let user = await User.get(testUserIds[0]);
		expect(user).toEqual({
			id: testUserIds[0],
			first_name: 'Test',
			last_name: 'User1',
			email: 'testuser@example.com',
			is_public: false
		});
	});
});

/************************************** update */

describe('update', function() {
	const updateData = {
		first_name: 'NewF',
		last_name: 'NewF',
		is_public: true
	};

	test('works', async function() {
		let user = await User.update(testUserIds[0], updateData);
		expect(user.first_name).toEqual(updateData.first_name);
	});

	test('not found if no such user', async function() {
		try {
			await User.update(1, {
				firstName: 'Test'
			});
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('bad request if no data', async function() {
		expect.assertions(1);
		try {
			await User.update(testUserIds[0], {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

// /************************************** remove */

// describe('remove', function() {
// 	test('works', async function() {
// 		await User.remove('u1');
// 		const res = await db.query("SELECT * FROM users WHERE username='u1'");
// 		expect(res.rows.length).toEqual(0);
// 	});

// 	test('not found if no such user', async function() {
// 		try {
// 			await User.remove('nope');
// 			fail();
// 		} catch (err) {
// 			expect(err instanceof NotFoundError).toBeTruthy();
// 		}
// 	});
// });
