/*jshint node:true*/
exports.admin = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'admin/admin',
		{
			'title': 'Admin @ MADCampos',
			'layout': 'admin/layout',
			'css': 'admin',
			'message': req.session.flash
		}
	);
};

exports.login = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'admin/login',
		{
			'title': 'Login @ MADCampos',
			'layout': 'admin/layout',
			'css': 'admin',
			'message': req.session.flash
		}
	);
};

exports.userAdd = function(req, res){
	require('../model').user.register({'name': req.params.name, 'email': req.params.email}, req.params.password, function(err, user){
		if (err){
			res.send(err);
		} else {
			res.send(user);
		}
	});
};