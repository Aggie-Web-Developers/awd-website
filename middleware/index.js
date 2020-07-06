var mwObject = {};

mwObject.checkAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/portal/login');
	}
};

mwObject.checkNotAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/portal/');
	}
};

module.exports = mwObject;
