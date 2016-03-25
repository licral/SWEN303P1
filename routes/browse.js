var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var display;

/* GET home page. */
router.get('/', function(req, res, next) {
	display = "browse";
	client.execute("XQUERY db:list('Colenso')",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse", 
					place: result.result.split("\n"), 
					display: display
					});
			}
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
