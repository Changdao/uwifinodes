var autoCorrect = angular.module('autoCorrect',['wifiNodeService','ui.bootstrap']);

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

autoCorrect.controller('autoCorrectCtrl',function($scope,$http,Node){
    
    $scope.map = new AMap.Map("mapContainer",{
            resizeEnable: true,
            //二维地图显示视口
            view: new AMap.View2D({
                center:new AMap.LngLat(98.281715, 39.780083),
                zoom:8 
            })
            
    });

    $scope.geocoder_CallBack=function(result,node,callback){
    
        if(result.geocodes.length)
        {
            geocode = result.geocodes[0];
            
            node.longitude = geocode.location.getLng();
            node.latitude = geocode.location.getLat();
            newNode = new Node(node);

            newNode.$save(function(data){
                
                console.log('===========save sucess');
                callback();
            },function(){
                console.log('!!!!!!!!!!!!!!failed');
                callback();
            });
            
        }
    };

    $scope.poi_CallBack=function(loc,node,callback){
        
            
            node.longitude = loc.lng;
            node.latitude = loc.lat;
            console.log('lng,lat',node.longitude);
            newNode = new Node(node);
            newNode.$save(function(data){
    
                console.log('===========save sucess');
                callback();
            },function(){
                console.log('!!!!!!!!!!!!!!failed');
                callback();
            });
        
    };
    var nullLocation = {
        lng:0,
        lat:0
    };
    
    $scope.locateAddress=function(node,callback){
        var MGeocoder;
        //加载地理编码插件
        /*AMap.service(["AMap.Geocoder"], function() {
            MGeocoder = new AMap.Geocoder({
                //city:"010", //城市，默认：“全国”
                //city:'0539',
                city:'香港',
                radius:1000 //范围，默认：500
            });
            //返回地理编码结果
            //地理编码
            MGeocoder.getLocation(node.location, function(status, result){
                console.log("==>",node.location," //status:",status,result);
                if(status === 'complete' && result.info === 'OK'){
                    $scope.geocoder_CallBack(result,node,callback);
                }
            });
        });*/

        AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                pageIndex: 1,
                city: "香港"
                // map: $scope.map,
                // panel: "panel"
            });
            //关键字查询
            /*var locationStr = node.location;
            var l = locationStr.split(',');
            if(l.length){
                if(l[l.length-1]=='New Territories')l.splice(l.length-1,1);
                if(l[0].startsWith('Shop'))l.splice(0,1);
                if(l[0].indexOf('/F'))l.splice(0,1);
            }
            locationStr = l.join(',');
            

            console.log('==>New location:',locationStr);
            */
            var locationStr = node.location_cn;
            var l=locationStr.split(' ');
            if(l.length)locationStr = l[l.length-1];

            placeSearch.search(locationStr,function(status,result){
              
              console.log("==>",locationStr," //status:",status,result);
                if(status === 'complete' && result.info === 'OK'){
                    var p = result.poiList.pois[0]?result.poiList.pois[0].location:nullLocation;
                    console.log(p);
                    if(p&&p.lng)
                        $scope.poi_CallBack(p,node,callback);
                    else 
                        $scope.poi_CallBack(nullLocation,node,callback);
                }
                else
                    $scope.poi_CallBack(nullLocation,node,callback);
            });
        });

    };

    $scope.progress =1;

    $scope.updateMap = function(node,callback){
        console.log('updating node, id:'+node.id+' name:'+node.brand);
        $scope.locateAddress(node,callback);
    };

    $http.get('api/nodes/nolatlng',{}).success(function(data){
        $scope.nodes = data;
        console.log('==========begin....');
        console.log($scope.nodes.length);
        iterations = $scope.nodes.count;

        asyncLoop(100,function(loop){
            
            node = $scope.nodes[loop.iteration()];
            $scope.updateMap(node,function(){
                // log the iteration
                console.log(loop.iteration());

                // Okay, for cycle could continue
                $scope.progress = loop.iteration()+1;
                loop.next();
            });
        },function(){
            console.log('========>complete?');
        });
    });

});

