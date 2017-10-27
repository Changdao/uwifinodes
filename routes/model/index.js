var Sequelize = require('sequelize');
var localDBUrl = 'postgres://wifinode:3y5@localhost:5432/wifinode';
var sequelize = new Sequelize(localDBUrl);

var Node = sequelize.define('nodes',
	{	
		f1:{type:Sequelize.STRING,field:"f1"},
        brand:{type:Sequelize.STRING,field:'brand'},
        location_cn:{type:Sequelize.STRING,field:'location_cn'},
        location_en:{type:Sequelize.STRING,field:'location_en'},
        node_type:{type:Sequelize.STRING,field:'node_type'},
        node_type_en:{type:Sequelize.STRING,field:'node_type_en'},
        area:{type:Sequelize.STRING,field:'area'},
        area_en:{type:Sequelize.STRING,field:'area_en'},
        block:{type:Sequelize.STRING,field:'block'},
        block_en:{type:Sequelize.STRING,field:'block_en'},
        location:{type:Sequelize.STRING,field:'location'},
        geo:{type:Sequelize.STRING,field:'location_gaode'},
        latitude:{type:Sequelize.DECIMAL(20,15),field:'lat'},
        longitude:{type:Sequelize.DECIMAL(20,15),field:'long'}
    },
    {
   		freezeTableName: true, // Model tableName will be the same as the model name
   		createdAt:'created_at',
   		updatedAt:'updated_at'
 	});




module.exports.Node = Node;