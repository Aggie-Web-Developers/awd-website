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

mwObject.checkIsOfficer = function (req, res, next) {
	if (!req.isAuthenticated()) {
		res.redirect('/portal/login');
	} else if (req.user.officer_id == null || req.user.officer_id <= 0) {
		res.redirect('/portal/member');
	} else {
		return next();
	}
};

module.exports = mwObject;
