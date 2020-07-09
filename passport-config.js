const localStrategy = require('passport-local').Strategy,
	  bcrypt        = require('bcrypt'),
	  sql           = require('mssql');

function init(passport) {
	const authenticateUser = async (email, password, done) => {
		var sqlReq = new sql.Request()
		let user = await getUserByEmail(email);

		if (user == null){
			return done(null, false, { message: 'Authentication failed. Please check you credentials.'});
		}

		try {
			if (await bcrypt.compare(password, user.password_hash)){
				return done(null, user);
			} else {
				return done(null, false, { message: 'Authentication failed. Please check you credentials.'});
			}
		} catch (err){
			return done(e);
		}
	}

	passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser(async (id, done) => {
		try {
			let user = await getUserById(id);

			if (!user) {
		  		return done(new Error('Deserialization error.'));
			}
			
			done(null, user);

		} catch (e) {
			done(e);
		}
	});
}

function getUserByEmail(email) { 
	return new Promise((resolve, reject) => {
		var sqlReq = new sql.Request().input("email", sql.NVarChar, email);

		sqlReq.query("SELECT TOP 1 * FROM tbl_user WHERE email = @email").then(result => {
			resolve(result.recordset[0]);
		}).catch(err => {
			resolve(null);
		});
	});
}

function getUserById(id) { 
	return new Promise((resolve, reject) => {
		var sqlReq = new sql.Request().input("id", sql.Int, id);

		sqlReq.query("SELECT TOP 1 * FROM tbl_user WHERE id = @id").then(result => {
			resolve(result.recordset[0]);
		}).catch(err => {
			resolve(null);
		});
	});
}

module.exports = init;