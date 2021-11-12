const jwt = require('jsonwebtoken');
const { createToken } = require('./tokens');
const { SECRET_KEY } = require('../config');

describe('createToken', function() {
	it('should create a token for authorization', function() {
		const token = createToken({ email: 'testuser@example.com' });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			email: 'testuser@example.com'
		});
	});
});
