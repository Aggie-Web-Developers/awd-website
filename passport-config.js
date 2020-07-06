const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sql = require('mssql');

function init(passport) {
	const authenticateUser = async (email, password, done) => {
		var sqlReq = new sql.Request(),
			user = null;

		let userQuery = await getUserByEmail(email);
		user = userQuery;

		if (user == null) {
			return done(null, false, {
				message: 'Authentication failed. Please check you credentials.',
			});
		}

		try {
			if (await bcrypt.compare(password, user.password_hash)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Authentication failed. Please check you credentials.',
				});
			}
		} catch (err) {
			return done(e);
		}
	};

	passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser(async (id, done) => {
		try {
			let user = await getUserById(id);

			// TODO: Better error handling here
			if (!user) {
				return done(new Error('User could not be found.'));
			}

			done(null, user);
		} catch (e) {
			done(e);
		}
	});
}

function getUserByEmail(email) {
	return new Promise((resolve, reject) => {
		var sqlReq = new sql.Request().input('email', sql.NVarChar, email);

		sqlReq.query(
			'SELECT TOP 1 * FROM tbl_user WHERE email = @email',
			(err, result) => {
				if (err) reject(err);
				resolve(result.recordset[0]);
			}
		);
	});
}

function getUserById(id) {
	return new Promise((resolve, reject) => {
		var sqlReq = new sql.Request().input('id', sql.Int, id);

		sqlReq.query(
			'SELECT TOP 1 * FROM tbl_user WHERE id = @id',
			(err, result) => {
				if (err) reject(err);
				resolve(result.recordset[0]);
			}
		);
	});
}

module.exports = init;
