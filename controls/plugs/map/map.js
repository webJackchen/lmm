$(function () {
    var url = "";
    if (!!window.lanh) {
        url = lanh.apiPath + "proxy?isMember=true";
    } else {
        url = "/action/member_list?i={0}&type=json".replace("{0}", window.location.host.substring(0, window.location.host.indexOf(".")));
    }
    $.get(url, function (location) {
        if (!!location.jsonText) {
            location = JSON.parse(location.jsonText).channel;
        } else {
            location = JSON.parse(location).channel;
        }
        var longitude = location.item.longitude.text,
            latitude = location.item.latitude.text,
            mapPanel = $("#_panelId_ #mapDiv")[0];
        if (location.item.address) {
            var address = location.item.address.text
        } else {
            var address = "";
        }

        var addressContact = $("#mapDiv").attr("address"), addressLink = $("#mapDiv").attr("link");
        if (addressContact != null && addressContact != "") {
            longitude = "";
            latitude = "";
           
            if (!!window.lanh) {
                address = addressContact;
                MapData(longitude, latitude, address, mapPanel);
                return;
            } else {
                url = "/action/itemlist?i={0}&type=json".replace("{0}", addressLink);
            }
            $.get(url, function (location) {
                if (!!location.jsonText) {
                    location = JSON.parse(location.jsonText).channel;
                } else {
                    location = JSON.parse(location).channel;
                }
               
                if (location.item.address) {
                     address = location.item.address.text
                } else {
                     address = "";
                }
                MapData(longitude, latitude, address, mapPanel);
                return;
            });
        }

        MapData(longitude, latitude, address, mapPanel);
     
    });
   
    function MapData(longitude, latitude, address, mapPanel) {
        var lng = "", lat = "";
        if (longitude != null && longitude != 0 && latitude != null && latitude != 0) {
            lng = longitude;
            lat = latitude;
            mapObj = new AMap.Map(mapPanel, {
                center: new AMap.LngLat(lng, lat),
                level: 13
            });
            addMarker(lng, lat);
        } else if (address != "" && address != null) {/*通过地址定位*/
            var MGeocoder;
            //加载地理编码插件
            AMap.service(["AMap.Geocoder"], function () {
                MGeocoder = new AMap.Geocoder({
                    city: "", //城市，默认：“全国”
                    radius: 1000 //范围，默认：500
                });
                //返回地理编码结果  
                //地理编码
                MGeocoder.getLocation(address, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        lng = result.geocodes[0].location.getLng();
                        lat = result.geocodes[0].location.getLat();
                    } else {
                        lng = 104.060032;
                        lat = 30.578002;
                    }
                    mapObj = new AMap.Map(mapPanel, {
                        center: new AMap.LngLat(lng, lat),
                        level: 15
                    });
                    addMarker(lng, lat);
                });
            });
        } else {
            lng = 104.060032;
            lat = 30.578002;
            mapObj = new AMap.Map(mapPanel, {
                center: new AMap.LngLat(lng, lat),
                level: 15
            });
            addMarker(lng, lat);
        }
    }

    //实例化点标记
    function addMarker(lng, lat) {
        marker = new AMap.Marker({
            icon: "http://webapi.amap.com/images/1.png",
            position: new AMap.LngLat(lng, lat)
        });
        marker.setMap(mapObj);  //在地图上添加点
    }
});