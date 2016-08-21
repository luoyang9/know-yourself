var express = require('express');
var router = express.Router();
var Clarifai = require('clarifai');
 
Clarifai.initialize({
  'clientId': 'Pt_cXyR1tRML6itUP9z725harlxVmqIctFh8DM1d',
  'clientSecret': 'rUYY5LDABKviS_PiaRoYpoOANf9Os7F7iptbW1pm'
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/imageTags', function(req, res){
	
	var photos = req.body.photos.map(function(obj) {
		return obj.picture;
	});

	Clarifai.getTagsByUrl(photos).then(
	  function(data){
	  	console.log(data.length);
	  	res.send(data);
	  },
	  function(err) {
	  	console.log("indico failed: ", err);
	  }
	);
});


module.exports = router;
