var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var xquery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";
var query;
var display;
var search_query = "hello";


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.query.queryfield === ""){
		query = xquery + "//TEI[. contains text " + req.query.fullfield + "]";
		search_query = req.query.fullfield;
		display = true;
	} else {
		query = xquery + req.query.queryfield;
		search_query = req.query.queryfield;
		display = true;
	}
	client.execute(query,
		function(error, result){
			if(error){
				console.error(error);
			} else {
				if(result.result === ""){
					display = false;
				}
				res.render('search', {
					title: "Search", 
					place: result.result.split("\n"),
					display: display,
					query: search_query
					});
			}
		});
});

module.exports = router;
