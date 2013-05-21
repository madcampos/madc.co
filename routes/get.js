/*global __, __n*/
var db = require('../model');
/**
 * Building page
 */
exports.building = function(req, res){
	res.header('Cache-Control','public, max-age=31556926000');
	res.render(
		'building',
		{
			'title': 'MADCampos',
			'layout': false,
			'css': 'building'
		}
	);
};

/**
 * the main site's page
 */
exports.index = function(req, res){
	res.header('Cache-Control','public, max-age=31556926000');
	res.render(
		'index',
		{
			'title': 'MADCampos',
			'css': 'style'
		}
	);
};

/**
 * Test Page
 */
exports.beta = function(req, res){
	res.header('Cache-Contorl', 'public, max-age=2629743830');
	res.render(
		'beta',
		{
			'title': '\u03B2 @ MADCampos',
			'css': 'style'
		}
	);
};

/**
 * Contact
 */
exports.contact = function(req, res){
	res.header('Cache-Control','public, max-age=31556926000');
	res.render(
		'contact',
		{
			'title': 'Contact @ MADCampos',
			'css': 'style'
		}
	);
};

/**
 * Site Privacy Police
 */
exports.privacy = function(req, res){
	res.header('Cache-Control','public, max-age=31556926000');
	res.render(
		'policy',
		{
			'title': 'Privacy Policy @ MADCampos',
			'css': 'style'
		}
	);
};

/**
 * Site map
 */
exports.map = function(req, res){
	res.header('Cache-Control','public, max-age=2629743830');
	db.url.find({}, function(err, urls){
		if (err) {
			res.redirect('/404');
		} else {
			res.render(
				'map',
				{
					'title': 'Site Map @ MADCampos',
					'css': 'style',
					'urls': urls
				}
			);
		}
	});

};

/**
 * IE App.
 */
exports.ie = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.render(
		'ie',
		{
			'title': 'MADCampos - Pinned Site',
			'css': 'style'
		}
	);
};