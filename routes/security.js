var csp = 'default-src \'self\';script-src *.google-analytics.com;style-src \'self\'';

exports.strictTransport = function(req, res, next){
	res.header('Strict-Transport-Security', 'max-age=2629743830; insludeSubdomains');
	next();
}

exports.contentTypeOptions = function(req, res, next){
	res.header('X-Content-Type-Options', 'nosniff');
	next();
}

exports.xssIE = function(req, res, next){
	res.header('X-XSS-Protection', '1; mode=block');
	next();
}

exports.iframeOptions = function(req, res, next){
	res.header('X-Frame-Options', 'sameorigin');
	next();
}

exports.csrf = function(req, res, next){
	res.locals.csrfToken = req.csrfToken();
	next();
}

exports.csp = function(req, res, next){
	res.header('X-WebKit-CSP', csp);
	res.header('Content-Security-Policy', csp);
	next();
}

//TODO: public key pins https://www.owasp.org/index.php/Certificate_and_Public_Key_Pinning
//TODO: export sanitization options
//TODO: make this as a global lib?
