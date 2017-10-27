var express = require('express');
var router = express.Router();
var model = require('./model');

/* GET users listing. */
router.get('/nodes', function(req, res, next) {
  model.Node.findAll().then(function(nodes){
  	res.send(nodes);
  }).catch(function(err){
  	console.error(err);
  	res.status(500).end();
  })
});

router.get('/nodes/nolatlng',function(req,res,next){
  model.Node.findAll({where:{lat:{$eq:null},long:{$eq:null}}}).then(function(results){
  	res.send(results);
  }).catch(function(err){
  	console.error(err);
  	res.status(500).end();
  })
});

router.post('/nodes',function(req,res,next){
  _id= req.body["id"];
  if(_id){
  	model.Node.findById(_id).then(function(node){
  		if(node)
  		{
  			return node.update({longitude:req.body['longitude'],latitude:req.body['latitude']},{returning:true})
  		}
  		else throw new Error('error');
  	}).then(function(obj){
  		res.send(obj);
  	}).catch(function(err){
  		console.error(err);
  		res.status(403).end();
  	});
  }
  else
  {
  	res.status(403).end();
  }
  
});

module.exports = router;
