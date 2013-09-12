var csp = 'default-src \'self\';script-src \'unsafe-inline\' *.google-analytics.com;style-src \'self\';options inline-script;report-uri /csp-report';

exports.strictTransport function(req, res, next){
	res.header('Strict-Transport-Security', 'max-age=2629743830; insludeSubdomains');
	next();
}

exports.contentTypeOptions function(req, res, next){
	res.header('X-Content-Type-Options', 'nosniff');
	next();
}

exports.xssIE function(req, res, next){
	res.header('X-XSS-Protection', '1; mode=block');
	next();
}

exports.iframeOptions function(req, res, next){
	res.header('X-Frame-Options', 'sameorigin');
	next();
}

exports.csrf function(req, res, next){
	res.header('X-CSRF-Token', req.session._csrf);
	next();
}

exports.csp function(req, res, next){
	res.header('X-Content-Security-Policy', csp);
	res.header('X-WebKit-CSP', csp);
	res.header('Content-Security-Policy', csp);
	next();
}