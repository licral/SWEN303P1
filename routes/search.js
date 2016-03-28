var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');

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
				var xml_info = [];
				var place;
				var type;
				if(result.result === ""){
					display = false;
				} else {
					var parse = cheerio.load(result.result, {xmlMode: true});
					var doc_data = parse("TEI");
					doc_data.each(function(index, element){
						element = cheerio(element);
						xml_info.push({
							title: element.find('title').first().text(),
							author: element.find('author').first().text(),
							id: element.attr('xml:id')
						})
					})
					if(xml_info.length > 0){
						place = xml_info;
						type = "cheerio";
					} else {
						type = "normal";
						place = result.result.split('\n');
					}
				}
				res.render('search', {
					title: "Search", 
					place: place,
					display: display,
					type: type,
					query: search_query
					});
			}
		});
});

router.get('/display/:id', function(req, res, next) {
	var id = req.url.split('/');
	client.execute(xquery + " //TEI[@xml:id='" + req.params.id + "']",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.render('browse', {
					title: "Browse",
					display: "human",
					place: result.result.split('\n')
					});
			}
		});
});

router.get('/raw-display/:id', function(req, res, next) {
	var id = req.url.split('/');
	client.execute(xquery + " //TEI[@xml:id='" + req.params.id + "']",
		function(error, result){
			if(error){
				console.error(error);
			} else {
				res.set('Content-Type', 'text/xml');
				res.send(result.result);
			}
		});
});

module.exports = router;
