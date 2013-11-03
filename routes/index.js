/*jshint node:true */
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
	api = require('./api'),
	images = require('./images'),
	security = require('./security');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.status(401).redirect('/login');
}

module.exports = function(spdy, http) {
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
	spdy.all('*', security.csrf);
	spdy.all('*', security.csp);
	spdy.all('*', security.strictTransport);
	spdy.all('*', security.contentTypeOptions);
	spdy.all('*', security.xssIE);
	spdy.all('*', security.iframeOptions);
	/**
	 * GET
	 */
	spdy.get('/', get.building);
	spdy.get('/home', get.building);
	spdy.get('/map', get.map);
	spdy.get('/beta', get.beta);
	spdy.get('/blog/:post?', blog);
	spdy.get('/privacy', get.privacy);
	//TODO: remove hack
	spdy.get('/portifolio/starfield', function(req, res){
		res.render('portifolio/starfield',
			{
				'title': 'Starfield @ MADCampos',
				'css': 'portifolio/starfield',
				'layout': false
			});
	});
	spdy.get('/portifolio/:item?', portifolio);
	spdy.get('/contact', get.contact);
	spdy.get('/search', search.search);
	spdy.get('/search/suggestion', search.searchSuggestion);
	spdy.get('/ie', get.ie);

	//Admin
	spdy.get('/login', admin.login);
	spdy.get('/admin', ensureAuthenticated, admin.admin);
	spdy.get('/adduser/:name/:email/:password', admin.userAdd);

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
	spdy.get('/secretcowlevel', files.hackers);
	spdy.get('/scl', files.hackers);
	spdy.get('/dublin.rdf', files.dublin);
	spdy.get('/manifest.appcache', files.appcache);
	spdy.get('/offline.html', files.offlineFile);

	//responsive images & placeholders
	spdy.get('/img/o/:size/*.(jpg|png|gif)', images.responsive);
	spdy.get('/img/p/:size/:fg?/:bg?.(jpg|png|gif)', images.placeholder);

	/**
	 * POST
	 */
	spdy.post('/url', api.url);
	spdy.post('/login', passport.authenticate('local', {
		'successRedirect': '/admin',
		'failureRedirect': '/login',
		'failureFlash': true
	}));
	spdy.post('/search', search.search);

	/**
	 * Error handling
	 */
	spdy.get('/401', errors.unauthorized);
	spdy.get('/403', errors.forbidden);
	spdy.get('/404', errors.notFound);
	spdy.get('/old', errors.oldie);
	spdy.all('/*', errors.handleNotFound);
};
