var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get('/', function(req, res, next) {
	client.execute("XQUERY db:list('Colenso')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse", 
					place: result.result.split("\n"), 
					display: "browse"
					});
			}
		});
});

router.get('/display/*', function(req, res, next) {
	var search_url = req.url.replace("/display", "Colenso");
	client.execute("XQUERY doc('" + search_url + "')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					display: "human",
					place: result.result.split("\n")
					});
			}
		});
});

router.get('/raw-display/*', function(req, res, next) {
	var search_url = req.url.replace("/raw-display", "Colenso");
	client.execute("XQUERY doc('" + search_url + "')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.set('Content-Type', 'text/xml');
				res.send(result.result);
			}
		});
});

router.get('/edit/*', function(req, res, next) {
	var search_url = req.url.replace("/edit", "Colenso");
	client.execute("XQUERY doc('" + search_url + "')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Edit",
					display: "edit",
					place: result.result.split("\n"),
					url: search_url.replace("Colenso/", "")
					});
			}
		});
});

router.post('/*', function(req, res) {
	var url_list = req.url.split('/');
	var url = req.url.replace("/" + url_list[0], url_list[0]);
	var xml = req.body.textbox;
	client.execute('DELETE "' + url + '"',
		function(error, result){
			if(error){
				console.error(error);
			} else {
				client.execute('ADD TO "' + url + '" "' + xml + '"',
					function(error, result){
						if(error){
							console.error(error);
						} else {
							res.redirect('/browse');
						}
				});
			}
	});
});
module.exports = router;
