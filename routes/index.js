var express = require('express');
var router = express.Router();
var model = require('./model');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/autocorrect',function(req,res,next){
  res.render('autocorrect',{title:'autocorrect'});
});

router.get('/nodes/:id',function(req,res,next){
	var id = req.params['id'];
	model.Node.findById(id).then(function(node){
		console.log(node);
		res.render('node',{location_cn:node.location_cn,brand:node.brand,location:node.location});
	}).catch(function(err){
		res.status(404).end();
	});
});
module.exports = router;
