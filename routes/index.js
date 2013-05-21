var passport = require('passport'),
	model = require('../model'),
	errors = require('./errors'),
	feeds = require('./feeds'),
	files = require('./files'),
	get = require('./get'),
	post = require('./post'),
	portifolio = require('./portifolio'),
	blog = require('./blog'),
	redirect = require('./redirect'),
	search = require('./search'),
	admin = require('./admin'),
	api = require('./api');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.status(401).redirect('/login');
}

function csrf(req, res, next) {
	res.locals.token = req.session._csrf;
	next();
}

module.exports = function(spdy, http){
	/**
	 * Config and redirection
	 */
	//HTTP -> SPDY
	http.get('*', redirect.spdy);


	//Other redirects
	spdy.use(errors.errorHandling);
	spdy.get('*', redirect.ieTest);
	spdy.all('*', redirect.urlRedirect);
	spdy.all('*', redirect.langSettings);
	spdy.all('*', redirect.setPath);

	/**
	 * GET
	 */
	spdy.get('/', get.building);
	spdy.get('/home', get.building);
	spdy.get('/map', get.map);
	spdy.get('/beta', get.beta);
	spdy.get('/blog/:post?', blog);
	spdy.get('/privacy', get.privacy);
	spdy.get('/portifolio/:item?', portifolio);
	spdy.get('/contact', get.contact);
	spdy.get('/search', csrf, search.search);
	spdy.get('/search/suggestion', csrf, search.searchSuggestion);
	spdy.get('/ie', get.ie);

	//Admin
	spdy.get('/login', csrf, admin.login);
	spdy.get('/admin', ensureAuthenticated, csrf, admin.admin);

	//files (non html)
	spdy.get('/rss', feeds.rss);
	spdy.get('/atom', feeds.atom);
	spdy.get('/search.xml', files.openSearch);
	spdy.get('/p3p.xml', files.p3p);
	spdy.get('/geo.kml', files.googleEarth);
	spdy.get('/geo.rdf', files.geo);
	spdy.get('/pics.rdf', files.pics);
	spdy.get('/vCard.vcf', files.vCard);
	spdy.get('/privacy.xml', files.privacyxml);
	spdy.get('/BingSiteAuth.xml', files.bingAuth);
	spdy.get('/google3b01a5d2cb44d74f.html', files.googleAuth);
	spdy.get('/mywot8ea47245cda13f60294b.html', files.wotAuth);
	spdy.get('/sitemap.xml', files.siteMap);
	spdy.get('/robots.txt', files.robots);
	spdy.get('/humans.txt', files.humans);
	spdy.get('/hackers.txt', files.hackers);
	spdy.get('/dublin.rdf', files.dublin);
	spdy.get('/manifest.appcache', files.appcache);
	spdy.get('/offline.html', files.offlineFile);



	/**
	 * POST
	 */
	spdy.post('/url', api.url);
	spdy.post('/login', passport.authenticate('local', {
		'successRedirect': '/admin',
		'failureRedirect': '/login',
		'failureFlash': true
	}));
	spdy.post('/search', csrf, search.search);
	spdy.post('/csp-report', errors.cspReport);

	/**
	 * Error handling
	 */
	spdy.get('/401', errors.unauthorized);
	spdy.get('/403', errors.forbidden);
	spdy.get('/404', errors.notFound);
	spdy.get('/old', errors.oldie);
	spdy.get('/*.(swf|js|png|gif|flv|jpg|jpeg)', function(req, res){
		res.send('boo');
	});
	spdy.all('/*', errors.handleNotFound);
};