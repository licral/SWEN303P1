var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
router.use(upload.single('file'));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('upload', { title: 'Upload' });
});

router.post('/', function(req, res) {
	if(req.file){
		var xml = req.file.buffer.toString();
		client.execute('ADD TO "Colenso" " ' + xml + '"',
			function(error, result){
				if(error){
					console.error(error);
				} else {
					console.log("File uploaded")
				}
		});
	}
	res.redirect('/');
});

module.exports = router;
