/*global __,__n*/

/**
 * Error handling
 */
exports.errorHandling = function(err, req, res, next){
	console.log(err);
	switch (err.status) {
		case '403':
			res.status(403).redirect('/403');
			break;
		case '401':
			res.status(401).redirect('/401');
			break;
		default:
			res.render(
				'error/500',
				{
					'title': '500 @ MADCampos',
					'layout': false,
					'error': err
				}
			);
			break;
	}
};

/**
 * 401 Forbidden
 */
exports.forbidden = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'error/403',
		{
			'title': '403 @ MADCamapos',
			'layout': 'error/layout',
			'css': 'error'
		}
	);
};

/**
 * 403 Unauthorized
 */
exports.unauthorized = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'error/401',
		{
			'title': '401 @ MADCamapos',
			'layout': 'error/layout',
			'css': 'error'
		}
	);
};

/**
 * 404 Not Found
 */
exports.handleNotFound = function(req, res){
	res.status(404).redirect('/404');
};

exports.notFound = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.status(404).render(
		'error/404',
		{
			'title': '404 @ MADCamapos',
			'layout': 'error/layout',
			'css': 'error'
		}
	);
};

/**
 * Old IE
 */
exports.oldie = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'error/ie',
		{
			'title': 'Old Browsers @ MADCampos',
			'layout': 'error/layout',
			'css': 'ie'
		}
	);
};
