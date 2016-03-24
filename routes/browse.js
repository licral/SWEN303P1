var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var xquery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";
var query;
var query_type;
var display;

/* GET home page. */
router.get('/', function(req, res, next) {
	display = "browse";
	if(req.query.queryfield == null && req.query.fullfield == null){
		query = "XQUERY db:list('Colenso')";
		query_type = "Browse";
	} else if (req.query.queryfield == "" || req.query.queryfield == null){
		query = xquery + "//TEI[. contains text " + req.query.fullfield + "]";
		query_type = "Search Results";
	} else {
		query = xquery + req.query.queryfield;
		query_type = "Search Results";
	}
	client.execute(query,
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse", 
					place: result.result.split("\n"), 
					type: query_type,
					display: display
					});
			}
			console.log(result);
		});
});

router.get('/display/*', function(req, res, next) {
	display = "human";
	var search_url = req.url.replace("/display", "Colenso");
	client.execute("XQUERY doc('" + search_url + "')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse",
					display: display,
					place: result.result.split("\n")
					});
			}
		});
});


router.get('/raw-display/*', function(req, res, next) {
	display = "raw";
	var search_url = req.url.replace("/raw-display", "Colenso");
	client.execute("XQUERY doc('" + search_url + "')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse",
					display: display,
					place: result.result.split("\n")
					});
			}
		});
});
module.exports = router;
