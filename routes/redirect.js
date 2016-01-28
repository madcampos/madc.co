/*jshint node:true*/
var i18n = require('i18n');

/**
 * SPDY redirection from HTTP
 */
exports.spdy = function(req, res){
	res.header('Location', 'https://' + req.host + req.url);
	res.redirect(301, 'https://' + req.host + req.url);
};

exports.setPath = function(req, res, next){
	res.locals.rootPath = 'https://' + req.host;
	res.locals.url = res.locals.rootPath + req.originalUrl;
	res.locals.blogPath = 'https://blog.' + req.host;
	res.locals.portifolioPath = 'https://portifolio.' + req.host;
	res.locals.menu = [
		['/home','Home'],
		['/portifolio','Portifolio'],
		['/blog','Blog'],
		['/beta','\u03B2 (Beta)'],
		['/contact','Contact'],
		['/map','Sitemap']
	];
	res.locals.currentPath = req.path;
	next();
};

/**
 * Test if the user-agent is Internet Explorer 8 or lower
 */
exports.ieTest = function(req, res, next){
	//TODO: remove this line
	console.log(req.header('user-agent'));
    //TODO: test
	if (req.header('User-Agent').match(/\.*MSIE (5|6|7|8)\.*/) && (req.url != 'old' || /\/img\/browsers\/*.\.png/.test(req.url))) {
		res.redirect(301, '/old');
	} else {
		res.header('Vary', 'User-Agent, Accept-Encoding, Cookie');
		next();
	}
};

/**
 * Test if not loading from www.host
 */
exports.urlRedirect = function(req, res, next){
	if (req.host.match(/^www/)) {
		res.redirect(301, 'https://' + req.host.replace(/^www\./, '') + req.url);
	} else {
		//TODO: keep or remove?
		switch(req.host.replace(/\.\w{3}\.\w{2}$|\.\w{3}$|\.\w{2}$/, '').split('.').slice(0,-1).reverse()[0]) {
		case 'blog':
			res.redirect(301, 'https://' + req.host.replace(/^blog\./, '') + '/blog' + req.path);
			break;
		case 'beta':
			res.redirect(301, 'https://' + req.host.replace(/^beta\./, '') + '/beta');
			break;
		case 'm':
			//TODO: give smallname
			res.redirect(301, 'https://madc.co');
			break;
		default:
			next();
			break;
		}
	}
};

/**
 * Set language for the page been loaded
 */
exports.langSettings = function(req, res, next){
	//TODO: set langs based in subdomain: http://ejohn.org/blog/a-strategy-for-i18n-and-node/
	var lang;

	if (req.header('accept-language')) {
		res.locals.languages = req.header('accept-language').toLowerCase().match(/(\w\w-\w\w)|(\w\w)/g);
		lang = res.locals.languages[0];
		res.locals.regions = req.header('accept-language').match(/(\w\w-\w\w)/g).map(function(el){
			return el.split('-')[1].toLowerCase();
		});
		res.locals.region = res.locals.regions[0];
	} else {
		lang = 'en';
	}

	if (req.cookies && req.cookies.lang && req.cookies.lang !== lang) {
		lang = req.cookies.lang;
	}

	if (/^(\w\w|\w\w-\w\w)\./.test(req.host)) {
		lang = req.host.match(/(\w\w-\w\w)|(\w\w)/g)[0].toLowerCase();
	}

	res.locals.__ = res.app.locals.__;
	res.locals.__n = res.app.locals.__n;
	//TODO: set cookie to secure.
	res.cookie('lang', lang, {'secure': true, 'maxAge': 2629743830, 'httpOnly': true});
	res.locals.language = lang;
	//TODO: classify rtl languages
	res.locals.direction = 'ltr';
	i18n.setLocale(lang);

	next();
};
