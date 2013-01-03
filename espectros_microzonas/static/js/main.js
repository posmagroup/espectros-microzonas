//
// Using dictionary objects as namespaces for functions (better organization of
// code)
// 
// Each dictionary item is defined like this:
// key: function ([params]) { },
// 

// window.mapping namespace for the map-related functions.
//

server_ip = "190.73.12.114";
geoserver_url = "http://"+ server_ip +":8080/geoserver/microzonas/wms";

window.mapping = {
    handler: function (request) {
        // do something with the response
        alert(request.responseText);
        /*for (var key in request){
            alert(key + ":" + request[key]);
        }*/
     },

    init: function() {
        //OpenLayers.ProxyHost="/proxyhost?url=";
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
        format = 'image/png';

        var bounds = new OpenLayers.Bounds(
                701278.4525937159, 1143737.188069312,
                752974.5281932829, 1169040.7596747405
        );

        var options = {
            controls: [],
            maxExtent: bounds,
            maxResolution: 201.93779531080872,
            projection: "EPSG:2202",
            units: 'm'
        };

        var map = new OpenLayers.Map('map', options);

        var wms_3 = new OpenLayers.Layer.WMS( "Laderas",
                geoserver_url,
                {
                    layers: 'microzonas:Microzonas_Laderas',
                    format: "image/png",
                    transparent: "true"
                    //0x85C247,
                },
                {isBaseLayer: false});


        var wms_2 = new OpenLayers.Layer.WMS( "Sedimentos",
                geoserver_url,
                {
                    layers: 'microzonas:Microzonas_Sedimentos',
                    format: "image/png",
                    style: "",
                    transparent: "true"
                    // 0x886744
                },
                {isBaseLayer: false});

        var wms_1 = new OpenLayers.Layer.WMS( "Amenaza General",
                geoserver_url,
                {
                    layers: 'microzonas:Microzonas_Amenaza_General',
                    format: "image/png",
                    transparent: "true"
                },
                {isBaseLayer: true}
        );

        map.addLayers([wms_1, wms_2, wms_3]);

        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.Navigation());
        map.zoomToExtent(bounds);

        micro = new Microzonas();
        micro.registerMap(map, 'microzonas:Microzonas_Amenaza_General', '/getmicrozone/');
        $.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]],
                {
                    title:'Espectros elásticos. Modelo de ajuste.',
                    axes:{xaxis:{renderer: $.jqplot.LogAxisRenderer}}
                }
        );
    }
}
