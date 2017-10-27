'use strict';

var wifiNodeService = angular.module('wifiNodeService',['ngResource']);

wifiNodeService.factory('Node',['$resource',function($resource){

    return $resource('api/nodes/:id',{},{
            
            query:{method:'GET',params:{id:''},isArray:false},
            get:{
                method:'GET',
                transformResponse:function(data,headers){
                    
                    var obj = JSON.parse(data);
                    if(obj.created)obj.created = new Date(obj.created);

                    return obj;
                }
            },
            assignMe:{
                method:'POST',
                params:{assignMe:true},
                isArray:false
            }
        });
}]);