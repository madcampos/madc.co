/*global __, __n*/

exports.admin = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'admin/admin',
		{
			'title': 'Admin @ MADCampos',
			'layout': 'layout',
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
			'layout': 'layout',
			'css': 'admin',
			'message': req.session.flash
		}
	);
};