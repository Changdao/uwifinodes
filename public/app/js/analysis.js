var wifiNodes = angular.module('wifiNodes',[]);


wifiNodes.controller('wifiNodesCtrl',function($scope,$http,$window){

        var cluster;
        var markers= [];
        //地图初始化&向地图随机加点
        var map = new AMap.Map("mapContainer",{
            resizeEnable: true,
            //二维地图显示视口
            view: new AMap.View2D({
                center:new AMap.LngLat(114.189615000000000, 22.275745000000000),
                zoom:10 
            })
            
        });
        map.plugin(["AMap.ToolBar"],function(){
            //加载工具条
            var tool = new AMap.ToolBar();
            map.addControl(tool);

        });
            
        // 随机向地图添加500个标注点
        var mapBounds = map.getBounds();
        var sw = mapBounds.getSouthWest();
        var ne = mapBounds.getNorthEast();
        var lngSpan = Math.abs(sw.lng - ne.lng);
        var latSpan = Math.abs(ne.lat - sw.lat);
        
        

        $http.get('api/nodes',{}).success(function(data){
            for (var i = 0; i < data.length; i ++) {
                node = data[i];
                lng = node.longitude||114.189615000000000;
                lat = node.latitude||22.275745000000000;
                var markerPosition = new AMap.LngLat(lng,lat);
                var marker = new AMap.Marker({
                    //基点位置
                    position:markerPosition, 
                    //marker图标，直接传递地址url
                    icon:"http://developer.amap.com/wp-content/uploads/2014/06/marker.png", 
                    title:node.name,
                    //相对于基点的位置
                    offset:{x:-8, y:-34}
                });
                marker.id = node.id;
                AMap.event.addListener(marker,"click",function(event){
                    $window.location.href="node#/"+event.target.hotelId;
                });
                markers.push(marker);
            }
            AMap.event.addListener(map,"click",function(evt){
                    console.log(evt.lnglat);
            });
            addCluster(0);
        });
        
        
        //添加点聚合
        function addCluster(tag)
        {
            if(cluster) {   
                cluster.setMap(null);
            }
            if(tag==1) {
                var sts=[{url:"http://developer.amap.com/wp-content/uploads/2014/06/1.png", size:new AMap.Size(32,32),offset:new AMap.Pixel(-16,-30)},
                    {url:"http://developer.amap.com/wp-content/uploads/2014/06/2.png", size:new AMap.Size(32,32),offset:new AMap.Pixel(-16,-30)},
                    {url:"http://developer.amap.com/wp-content/uploads/2014/06/3.png", size:new AMap.Size(48,48),offset:new AMap.Pixel(-24,-45),textColor:'#CC0066'}];
                map.plugin(["AMap.MarkerClusterer"],function(){
                    cluster = new AMap.MarkerClusterer(map,markers,{styles:sts});
                });
            }
            else {
                map.plugin(["AMap.MarkerClusterer"],function(){
                    cluster = new AMap.MarkerClusterer(map,markers);
                });
            }
        }

});