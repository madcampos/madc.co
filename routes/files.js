/*global __, __n*/

/**
 * Open Search descriptor file
 */
exports.openSearch = function(req, res){
	var xml = '<?xml version="1.0" encoding="UTF-8" ?>';
	xml += '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:referrer="http://a9.com/-/opensearch/extensions/referrer/1.0/" xmlns:suggestions="http://www.opensearch.org/specifications/opensearch/extensions/suggestions/1.1" xmlns:ie="http://schemas.microsoft.com/Search/2008/">';
	xml += '<ShortName>' + res.locals.__('MADcampos') + '</ShortName>';
	xml += '<Description>' + res.locals.__('Busca em MADCampos.') + '</Description>';
	xml += '<LongName>'+ res.locals.__('Resultados de busca para o blog: MADCampos.') + '</LongName>';
	xml += '<Image type="image/x-icon" width="16" height="16">' + res.locals.rootPath + '/favicon.ico</Image>';
	xml += '<Url type="application/opensearchdescription+xml" rel="self" href="' + res.locals.rootPath + '/search.xml"/>';
	xml += '<Url type="application/atom+xml" rel="results" template="' + res.locals.rootPath + '/search?f=atom&amp;q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}&amp;n={count?}&amp;p={startPage?}&amp;i={startIndex?}"/>';
	xml += '<Url type="application/rss+xml" rel="results" template="' + res.locals.rootPath + '/search?f=rss&amp;q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}&amp;n={count?}&amp;p={startPage?}&amp;i={startIndex?}"/>';
	xml += '<Url type="text/html" rel="results" template="' + res.locals.rootPath + '/search?q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}&amp;n={count?}&amp;p={startPage?}&amp;i={startIndex?}"/>';
	xml += '<Url type="application/x-application+json" rel="suggestion" template="' + res.locals.rootPath + '/search/suggestion?fmt=json&amp;q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}&amp;n={count?}&amp;p={startPage?}&amp;i={startIndex?}"/>';
	xml += '<Url type="application/x-application+xml" rel="suggestion" template="' + res.locals.rootPath + '/search/suggestion?fmt=xml&amp;q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}&amp;n={count?}&amp;p={startPage?}&amp;i={startIndex?}"/>';
	xml += '<AdultContent>false</AdultContent>';
	xml += '<Attribution>Creative Commons BY-NC-SA</Attribution>';
	xml += '<Contact>maurelio.campos@gmail.com</Contact>';
	xml += '<Developer>madcampos</Developer>';
	xml += '<InputEncoding>UTF-8</InputEncoding>';
	xml += '<Language>pt-br</Language>';
	xml += '<Language>en-us</Language>';
	xml += '<Language>pt-pt</Language>';
	xml += '<OutputEncoding>UTF-8</OutputEncoding>';
	xml += '<Query role="example" searchTerms="terms" />';
	xml += '<Query role="request" searchTerms="terms"/>';
	xml += '<Tags>webdeveloper webdesigner games usability</Tags>';
	xml += '<SyndicationRight>open</SyndicationRight>';
	xml += '<ie:PreviewUrl type="text/html" template="' + res.locals.rootPath + '/serach?f=preview&amp;q={searhTerms}&amp;l={Language?}&amp;ref={referrer:source?}"/>';
	xml += '</OpenSearchDescription>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('xml');
	res.send(xml);
};

/**
 * sitemap.xml
 */
exports.siteMap = function(req, res){
	var urls = [];
	var xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
	//TODO: browse DB
	for (var i in urls) {
		xml += '<url>';
		xml += '<loc>'+ res.locals.rootPath + urls[i][0] + '</loc>';
		xml += '</url>';
	}
	xml += '</urlset>';

	res.header('Cache-Control', 'public, max-age=2629743830');
	res.type('xml');
	res.send(xml);
};

/**
 * dublin.rdf
 */
exports.dublin = function(req, res){
	var xml = '<?xml version="1.0"?>';
	xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc= "http://purl.org/dc/elements/1.1/">';
	xml += '<rdf:Description rdf:about="' + res.locals.rootPath + '">';
	xml += '<dc:contributor>Marco Aurélio Dilda Campos</dc:contributor>';
	xml += '<dc:date>2012-08-06</dc:date>';
	xml += '<dc:description>' + res.locals.__('Estudante de Ciência da Computação pela UFMT, intusiasta por design, usabilidade e desenvolvimento de jogos e web.') + '</dc:description>';
	xml += '<dc:language>PT-BR</dc:language>';
	xml += '<dc:publisher>MADCampos</dc:publisher>';
	xml += '<dc:source>http://www.github.com/madcampos/</dc:source>';
	xml += '</rdf:Description>';
	xml += '</rdf:RDF>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('rdf');
	res.send(xml);
};

/**
 * P3P.xml
 */
exports.p3p = function(req, res){
	var xml = '<?xml version="1.0" ?>';
	xml += '<meta xmlns="http://www.w3.org/2002/01/p3pv1" xml:lang="en">';
	xml += '<policy-references>';
	xml += '<policy-ref about="' + res.locals.rootPath + '/privacy.xml">';
	xml += '<include>/*</include>';
	xml += '</policy-ref>';
	xml += '</policy-references>';
	xml += '</meta>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('xml');
	res.send(xml);
};

/**
 * privacy.xml
 */
exports.privacyxml = function(req, res){
	var xml = '<?xml version="1.0"?>';
	xml += '<policy xmlns="http://www.w3.org/2002/01/p3pv1" discuri="' + res.locals.rootPath + '/privacy" opturi="' + res.locals.rootPath + '/privacy" name="privacy-policy-statement">';
	xml += '<entity>';
	xml += '<data-group>';
	xml += '<data ref="#business.name">madcampos</data>';
	xml += '</data-group>';
	xml += '</entity>';
	xml += '<access><nonident/></access>';
	xml += '<disputes-group>';
	xml += '<disputes resolution-type="service" service="' + res.locals.rootPath + '/privacy" short-description="html file">';
	xml += '<remedies>';
	xml += '<correct/>';
	xml += '</remedies>';
	xml += '</disputes>';
	xml += '</disputes-group>';
	xml += '<statement>';
	xml += '<consequence>we keep standard web server logs.</consequence>';
	xml += '<purpose><admin/><current/><develop/></purpose>';
	xml += '<recipient><ours/></recipient>';
	xml += '<retention><indefinitely /></retention>';
	xml += '<data-group>';
	xml += '<data ref="#dynamic.clickstream"/>';
	xml += '<data ref="#dynamic.http"/>';
	xml += '</data-group>';
	xml += '</statement>';
	xml += '</policy>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('xml');
	res.send(xml);
};

/**
 * Geo.kml
 */
exports.googleEarth = function(req, res){
	var xml = '<?xml version="1.0" encoding="UTF-8"?>';
	xml += '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">';
	xml += '<Document>';
	xml += '<name>Brighton</name>';
	xml += '<description>The place that I call home!</description>';
	xml += '<Style id="pin"><IconStyle><Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href></Icon></IconStyle></Style>';
	xml += '<Placemark>';
	xml += '<LookAt>';
	xml += '<longitude>-0.13642</longitude>';
	xml += '<latitude>50.819522</latitude>';
	xml += '<altitude>0</altitude>';
	xml += '<tilt>0</tilt>';
	xml += '<range>5500</range>';
	xml += '</LookAt>';
	xml += '<styleUrl>#pin</styleUrl>';
	xml += '<Point><coordinates>-0.13642,50.819522,0</coordinates></Point>';
	xml += '</Placemark>';
	xml += '</Document>';
	xml += '</kml>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('kml');
	res.send(xml);
};

/**
 * geo.rdf
 */
exports.geo = function(req, res){
	var xml = '<rdf:RDF xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:foaf="http://xmlns.com/foaf/0.1/" xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">';
	xml += '<rdf:Description rdf:about="http://www.mysite.com">';
	xml += '<dc:title>Brighton</dc:title>';
	xml += '<foaf:topic rdf:parseType="Resource">';
	xml += '<geo:lat>50.819522</geo:lat>';
	xml += '<geo:long>-0.13642</geo:long>';
	xml += '</foaf:topic>';
	xml += '</rdf:Description>';
	xml += '</rdf:RDF>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('rdf');
	res.send(xml);
};

/**
 * vCard.vcf
 */
exports.vCard = function(req, res){
	var txt = 'BEGIN:VCARD\n';
	txt += 'VERSION:4.0\n';
	txt += 'N:Campos;Marco;;;\n';
	txt += 'FN:Marco Aurélio D. Campos\n';
	txt += 'ORG:21DD\n';
	txt += 'TITLE:Designer\n';
	txt += 'PHOTO:' + res.locals.rootPath + '/img/me.jpg\n';
	txt += 'EMAIL:maurelio.campos@gmail.com\n';
	txt += 'ANNIVERSARY:19900923\n';
	txt += 'CATEGORIES:design,programming,games,ux,webdesign\n';
	txt += 'GENDER:M\n';
	txt += 'KIND:individual\n';
	txt += 'LANG:pt-BR\n';
	txt += 'LOGO;PNG:' + res.locals.rootPath + '/img/og/madcampos.png';
	txt += 'NICKNAME:madcampos,gome\n';
	txt += 'PROFILE:VCARD\n';
	txt += 'SOURCE:' + res.locals.rootPath + '/vCard.vcf\n';
	txt += 'URL:' + res.locals.rootPath + '\n';
	txt += 'END:VCARD';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('vcard');
	res.send(txt);
};

/**
 * PICS.rdf
 */
exports.pics = function(req, res){
	var xml = '<?xml version="1.0" encoding="iso-8859-1"?>';
	xml += '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:label="http://www.w3.org/2004/12/q/contentlabel#" xmlns:icra="http://www.icra.org/rdfs/vocabularyv03#" xmlns:rsac="http://www.icra.org/rdfs/vocabularyv01#"  xmlns:ss="http://www.safesurf.com/ssplan/" xmlns:sfk="http://www.weburbia.com/safe/ratings/ ">';
	xml += '<rdf:Description rdf:about="">';
	xml += '<dc:creator rdf:resource="http://www.icra.org" />';
	xml += '<dc:creator rdf:resource="http://www.safesurf.com" />';
	xml += '<dc:creator rdf:resource="http://www.weburbia.com/safe" />';
	xml += '<dcterms:issued>2011-04-15</dcterms:issued>';
	xml += '<label:authorityFor>http://www.icra.org/rdfs/vocabularyv03#</label:authorityFor>';
	xml += '</rdf:Description>';
	xml += '<label:Ruleset>';
	xml += '<label:hasHostRestrictions><label:Hosts><label:hostRestriction>' + res.locals.rootPath + '</label:hostRestriction></label:Hosts></label:hasHostRestrictions>';
	xml += '<label:hasDefaultLabel rdf:resource="#label_1" />';
	xml += '</label:Ruleset>';
	xml += '<label:ContentLabel rdf:ID="label_1">';
	xml += '<rdfs:comment>ICRA Ratings</rdfs:comment>';
	xml += '<icra:nz>0</icra:nz>';
	xml += '<icra:sz>0</icra:sz>';
	xml += '<icra:vz>0</icra:vz>';
	xml += '<icra:lz>0</icra:lz>';
	xml += '<icra:og>1</icra:og>';
	xml += '<icra:cz>0</icra:cz>';
	xml += '<icra:xa>1</icra:xa>';
	xml += '</label:ContentLabel>';
	xml += '<label:ContentLabel rdf:ID="label_2">';
	xml += '<rdfs:comment>RSACi Ratings</rdfs:comment>';
	xml += '<rsac:L>2</rsac:L>';
	xml += '<rsac:N>0</rsac:N>';
	xml += '<rsac:S>1</rsac:S>';
	xml += '<rsac:V>0</rsac:V>';
	xml += '</label:ContentLabel>';
	xml += '<label:ContentLabel rdf:ID="label_3">';
	xml += '<rdfs:comment>SafeSurf Ratings</rdfs:comment>';
	xml += '<ss:ss000>3</ss:ss000>';
	xml += '<ss:ss001>4</ss:ss001>';
	xml += '<ss:ss002>4</ss:ss002>';
	xml += '<ss:ss003>4</ss:ss003>';
	xml += '<ss:ss004>3</ss:ss004>';
	xml += '<ss:ss005>3</ss:ss005>';
	xml += '<ss:ss006>1</ss:ss006>';
	xml += '<ss:ss007>1</ss:ss007>';
	xml += '<ss:ss008>4</ss:ss008>';
	xml += '<ss:ss009>4</ss:ss009>';
	xml += '<ss:ss00A>4</ss:ss00A>';
	xml += '</label:ContentLabel>';
	xml += '<label:ContentLabel rdf:ID="label_4">';
	xml += '<rdfs:comment>WebUrbia Ratings</rdfs:comment>';
	xml += '<SFK:S>1</SFK:S>';
	xml += '</label:ContentLabel>';
	xml += '</rdf:RDF>';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('rdf');
	res.send(xml);
};

/**
 * Bing authentication file
 */
exports.bingAuth = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('xml');
	res.send('<?xml version="1.0"?><users><user>9D29BDAC0A995CE1D2996A620F7EE2C0</user></users>');
};

/**
 * Google authentication file
 */
exports.googleAuth = function(req,res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('html');
	res.send('google-site-verification: google3b01a5d2cb44d74f.html');
};

/**
 * Web of Thrust verification
 */
exports.wotAuth = function(req, res){
	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('html');
	res.send('c4016f456d6b902e00366ea18fc9a208');
};

/**
 * robots.txt file generation
 */
exports.robots = function(req, res){
	var text = 'User-agent: *\n';
	text += 'Disallow: /404\n';
	text += 'Disallow: /admin\n';
	text += 'Disallow: /login\n';
	text += 'Disallow: /admin/\n';
	text += 'Sitemap: ' + res.locals.rootPath + 'sitemap.xml\n';
	text += 'Crawl-delay: 86400\n';

	res.header('Cache-Control', 'public, max-age=2629743830');
	res.type('text');
	res.send(text);
};

/**
 * humans.txt
 */
exports.humans = function(req, res){
	var text = '/* TEAM */\n';
	text += 'Marco Curélio Dilda Campos\n';
	text += 'Site: ' + res.locals.rootPath + '\n';
	text += 'Twitter: @madcampos\n';
	text += 'Location: Cuiabá, MT, Brasil\n';
	text += '\n';
	text += '/* THANKS */\n';
	text += 'wesllei.h: http://weslleih.com.br\n';
	text += '\n';
	text += '/* SITE */\n';
	text += 'Standards: HTML5, CSS3, experimental stuff yay!\n';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('text');
	res.send(text);
};

/**
 * hackers.txt
 */
exports.hackers = function(req, res){
	var text = '- Take the blue pill Jhon, it\'ll be better for you...\n';
	text += '- Thanks for comming by, leave a message, and we will tallk soon.\n';
	text += '- As you can see this are the weirdos that came by:\n';
	text += '1.\tName:\n';
	text += '\tMessage:';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('text');
	res.send(text);
};

exports.appcache = function(req, res){
	var text = 'CACHE MANIFEST\n';
	text += '# v0.1\n';
	text += 'CACHE:\n';
	text += '/img/favicon/favicon.ico\n';
	text += '/style/style.css\n';
	text += '/js/ga.js\n';
	text += '/img/sprite.svg\n';
	text += '/img/logo.svg\n';
	text += '/img/error/line.svg\n';
	text += 'NETWORK:\n';
	text += '/admin\n';
	text += 'FALLBACK:\n';
	text += '*.html /offline.html\n';

	res.header('Cache-Control', 'public, max-age=31556926000');
	res.type('text/cache-manifest');
	res.send(text);
};

exports.offlineFile = function(req,res){
	res.header('Cache-Control','public, max-age=31556926000');
	res.render(
		'offline',
		{
			'title': 'MADCampos',
			'url': res.locals.rootPath,
			'css': 'style'
		}
	);
};