var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var xquery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';";
var test = "(//name[@type='place'])[1]";

/* GET home page. */
router.get('/', function(req, res, next) {
  client.execute(xquery + req.query.textfield,
    function(error, result){
      if(error){
        console.error(error);
      } else {
         res.render('browse', { title: 'Browse', place: result.result});
      }
    });
});

module.exports = router;
