/*global __, __n*/

/**
 * Search
 */
exports.search = function(req, res){
	var result,
		results = [],
		response;

	if (req.body.searchfield) {
		req.body.tag = req.body.tag || 'off';
		req.body.article = req.body.article || 'off';
		res.redirect(302, '/search?q=' + req.body.searchfield + '&t=' + req.body.tag + '&a=' + req.body.article);
		return;
	}

	req.query.q = req.query.q || '';
	req.query.n = req.query.n || 10;
	req.query.i = req.query.i || 0;
	req.query.p = req.query.p || 1;
	req.query.t = req.query.t || 'off';
	req.query.a = req.query.a || 'off';
	req.query.l = req.query.l || 'pt-br';
	req.query.ref = req.query.ref || 'no-ref';

	//TODO: db search

	switch (req.query.f) {
		case 'rss':
			response = '<?xml version="1.0" encoding="UTF-8"?>';
			response += '<rss version="2.0" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">';
			response += '<channel>';
			response += '<title>' + req.query.q + '</title>';
			response += '<link>' + res.locals.rootPath + req.originalUrl.replace(/&/g, '&amp;') + '</link>';
			response += '<description>' +  req.query.q + '</description>';
			response += '<opensearch:totalResults>' + results.length + '</opensearch:totalResults>';
			response += '<opensearch:startIndex>' + req.query.i + '</opensearch:startIndex>';
			response += '<opensearch:itemsPerPage>' + req.query.n + '</opensearch:itemsPerPage>';
			response += '<atom:link rel="search" type="application/opensearchdescription+xml" href="' + res.locals.rootPath + '/search.xml"/>';
			response += '<opensearch:Query role="request" searchTerms="' + req.query.q + '" startPage="' + req.query.p + '" />';
			//TODO: query from db
			for (result in results) {
				response += '<item>';
				response += '<title>' + results[result].title + '</title>';
				response += '<link>' + results[result].link + '</link>';
				response += '<description>' + results[result].content.slice(0,140) + '...</description>';
				response += '</item>';
			}
			response += '</channel>';
			response += '</rss>';
			res.type('rss');
			break;
		case 'atom':
			response = '<?xml version="1.0" encoding="UTF-8"?>';
			response += '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">';
			response += '<title>' + req.query.q + '</title>';
			response += '<link href="' + res.locals.rootPath + req.originalUrl.replace(/&/g, '&amp;') + '"/>';
			response += '<updated>' + Date.now() + '</updated>';
			response += '<author>';
			response += '<name>MADCampos</name>';
			response += '</author>';
			response += '<id>' + res.locals.rootPath + '</id>';
			response += '<opensearch:totalResults>' + results.length + '</opensearch:totalResults>';
			response += '<opensearch:startIndex>' + req.query.i + '</opensearch:startIndex>';
			response += '<opensearch:itemsPerPage>' + req.query.n + '</opensearch:itemsPerPage>';
			response += '<opensearch:Query role="request" searchTerms="' + req.query.q + '" startPage="' + req.query.p + '" />';
			response += '<link rel="search" type="application/opensearchdescription+xml" href="' + res.locals.rootPath + '/search.xml"/>';
			response += '<link rel="self" href="' + res.locals.rootPath + '/search?f=atom&amp;q=' + req.query.q + '&amp;l=' + req.query.l + '&amp;ref=' + req.query.ref + '&amp;n=' + req.query.n + '&amp;p=' + req.query.p + '&amp;i=' + req.query.i + '&amp;a=' + req.query.a + '&amp;t=' + req.query.t + '" type="application/atom+xml"/>';
			response += '<link rel="first" href="' + res.locals.rootPath + '/search?f=atom&amp;q=' + req.query.q + '&amp;l=' + req.query.l + '&amp;ref=' + req.query.ref + '&amp;n=' + req.query.n + '&amp;a=' + req.query.a + '&amp;t=' + req.query.t + '&amp;p=1&amp;i=1" type="application/atom+xml"/>';
			response += req.query.p > 1 ? '<link rel="previous" href="' + res.locals.rootPath + '/search?f=atom&amp;q=' + req.query.q + '&amp;l=' + req.query.l + '&amp;ref=' + req.query.ref + '&amp;n=' + req.query.n + '&amp;i=' + req.query.i - req.query.n + '&amp;p=' + req.query.p - 1 + '&amp;a=' + req.query.a + '&amp;t=' + req.query.t + '" type="application/atom+xml"/>' : '';
			response += req.query.p < results.length / req.query.n ? '<link rel="next" href="' + res.locals.rootPath + '/search?f=atom&amp;q=' + req.query.q + '&amp;l=' + req.query.l + '&amp;ref=' + req.query.ref + '&amp;n=' + req.query.n + '&amp;i=' + req.query.i + req.query.n + '&amp;p=' + req.query.p - 1 + '&amp;a=' + req.query.a + '&amp;t=' + req.query.t + '" type="application/atom+xml"/>' : '';
			response += '<link rel="last" href="' + res.locals.rootPath + '/search?f=atom&amp;q=' + req.query.q + '&amp;l=' + req.query.l + '&amp;ref=' + req.query.ref + '&amp;n=' + req.query.n + '&amp;p=' + results.length / req.query.n + '&amp;i=' + results.length + '&amp;a=' + req.query.a + '&amp;t=' + req.query.t + '" type="application/atom+xml"/>';
			//TODO: query from db
			for (result in results) {
				response += '<entry>';
				response += '<title>' + results[result].title + '</title>';
				response += '<link href="' + results[result].link + '"/>';
				response += '<id>' + results[result]._id + '</id>';
				response += '<updated>' + results[result].updated + '</updated>';
				response += '<content type="text">' + results[result].content.slice(0,140) + '...</content>';
				response += '</entry>';
			}
			response += '</feed>';
			res.type('atom');
			break;
		case 'preview':
			response = '<!DOCTYPE html>';
			response += '<html>';
			response += '<head>';
			response += '<meta charset="utf-8">';
			response += '<title>' + __('Busca: "') + req.query.q + '"</title>';
			response += '<link rel="stylesheet" href="' + res.locals.rootPath + '/style/preview.css"/>';
			response += '</head>';
			response += '<body>';
			response += '<h1>' + __('Resultados para: "') + req.query.q + '"</h1>';
			for (result in results) {
				response += '<div class="item">';
				response += '<a href="' + results[result].link + '" target="_blank"><h2>' + results[result].title + '</h2></a>';
				response += '<span class="time">' + results[result].updated + '</span>';
				response += '<a href="' + results[result].link + '" target="_blank"><img alt="' + results[result].thumb.alt + '" src="' + results[result].thumb.path + '"></a>';
				response += '<p>' + results[result].content.slice(0,100) + ' <a href="' + results[result].link + '" target="_blank">' + __('Mais...') + '</a></p>';
				response += '</div>';
			}
			response += '</body>';
			response += '</html>';
			res.type('html');
			break;
		case 'json':
			response = [req.query.q, [], [], []];
			results.forEach(function(el, i){
				response[1][i] = el.title;
				response[2][i] = el.content.slice(0,100);
				response[3][i] = el.link;
			});
			res.type('json');
			break;
		default:
			res.header('Cache-Control', 'public, max-age=2629743830');
			res.render(
				'search/index',
				{
					'title': 'Search @ MADCampos',
					'css': 'style',
					'totalResults': results.length,
					'startIndex': req.query.i,
					'itensPerPage': req.query.n,
					'query': req.query.q,
					'results': results,
					'tags' : req.query.t,
					'articles': req.query.a
				}
			);
			return;
	}
	res.send(response);
};

/**
 * Search Suggestion
 */
exports.searchSuggestion = function(req,res){
	var response,
		suggestion = [];

	req.query.q = req.query.q || '';
	req.query.i = req.query.i || 0;
	req.query.n = req.query.n || 10;


	if (req.query.f == 'json') {
		//response = [querystring, completion suggestion, descriptions, urls]
		response = [req.query.q, [], [], []];
		suggestion.forEach(function(el, i){
			response[1][i] = el.title;
			response[2][i] = el.content.slice(0,100);
			response[3][i] = el.link;
		});
		res.type('json');
	} else {
		response = '<?xml version="1.0"?>';
		response += '<SearchSuggestion xmlns="http://schemas.microsoft.com/Search/2008/suggestions">';
		response += '<Query>' + req.query.q.replace(/&/g, '&amp;') + '</Query>';
		response += '<Section>';
		//TODO: search db
		for (var item in suggestion) {
			response += '<Item>';
			response += '<Text>' + suggestion[item].title + '</Text>';
			response += '<Image source="' + suggestion[item].thumb.path + '" alt="' + suggestion[item].thumb.alt + '"/>';
			response += '<Description>' + suggestion[item].content.slice(0,100) + '...</Description>';
			response += '<Url>' + suggestion[item].link + '</Url>';
			response += '</Item>';
		}
		response += '</Section>';
		response += '</SearchSuggestion>';
		res.type('xml');
	}
	res.header('X-CSRF-Token', req.session._csrf);
	res.send(response);
};