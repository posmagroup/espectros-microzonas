//
// Using dictionary objects as namespaces for functions (better organization of
// code)
// 
// Each dictionary item is defined like this:
// key: function ([params]) { },
// 

// window.mapping namespace for the map-related functions.
//

geoserver_url = "http://190.73.10.65:8080/geoserver/microzonas/wms"

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

        /*map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.Navigation());*/
        map.zoomToExtent(bounds);

        // support GetFeatureInfo
        map.events.register('click', map, function (e) {

            var params = {
                REQUEST: "GetFeatureInfo",
                EXCEPTIONS: "application/vnd.ogc.se_xml",
                BBOX: map.getExtent().toBBOX(), //????
                SERVICE: "WMS",
                INFO_FORMAT: 'text/html',
                QUERY_LAYERS: map.layers[0].params.LAYERS,
                FEATURE_COUNT: 50,
                Layers: 'microzonas:Microzonas_Amenaza_General',
                X: Math.round(e.xy.x), 
                Y: Math.round(e.xy.y), 
                WIDTH: map.size.w,
                HEIGHT: map.size.h,
                format: format,
                styles: map.layers[0].params.STYLES,
                srs: map.layers[0].params.SRS};

            // merge filters
            if(map.layers[0].params.CQL_FILTER != null) {
                params.cql_filter = map.layers[0].params.CQL_FILTER;
            }
            if(map.layers[0].params.FILTER != null) {
                params.filter = map.layers[0].params.FILTER;
            }
            if(map.layers[0].params.FEATUREID) {
                params.featureid = map.layers[0].params.FEATUREID;
            }
            //OpenLayers.loadURL("http://127.0.0.1:8080/geoserver/microzonas/wms", params, this, showAttributes, showAttributesError);
            OpenLayers.loadURL("http://127.0.0.1:8000/proxyhost/", params, this, window.mapping.handler, window.mapping.handler);
            
            /*OpenLayers.Request.GET({
                url: "http://localhost:8000/proxyhost/",
                params:params,
                //callback:showAttributes
                callback: window.mapping.handler
            });*/
            OpenLayers.Event.stop(e);
        });
    }

}


// window.charts namespace for the chart-related functions.
window.charts = {  }


// global functions. 
