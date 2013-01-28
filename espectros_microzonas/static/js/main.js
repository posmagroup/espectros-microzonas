//
// Using dictionary objects as namespaces for functions (better organization of
// code)
// 
// Each dictionary item is defined like this:
// key: function ([params]) { },
// 

// window.mapping namespace for the map-related functions.
//

server_ip = "190.73.11.219";
geoserver_url = "http://"+ server_ip +":8080/geoserver/microzonas/wms";

window.mapping = {
    handler: function (e) {

    },

    graficarEspectro: function(espectro){
        $("#mzid").html(espectro.name);
        $("#val_phi").html(espectro.phi);
        $("#val_beta").html(espectro.beta);
        $("#val_a0").html(espectro.A_0);
        $("#val_m").html(espectro.m);
        $("#val_p").html(espectro.p);
        $("#val_t0").html(espectro.T_0);
        $("#val_ta").html(espectro.T_A);
        $("#val_td").html(espectro.T_D);
        $("#val_tstar").html(espectro.T_star);

        var points = espectro.obtenerPuntos();

        $.jqplot('chartdiv',  [points],
                {
                    axesDefaults: {
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            fontSize: '8pt'
                        }
                        //,showTickMarks: false  //???
                    },
                    seriesDefaults: {
                        showMarker: false
                    },
                    axes:{
                        xaxis:{
                            renderer: $.jqplot.LogAxisRenderer

                            //label: "Período (s)"
                        },
                        yaxis:{
                            //label: "Aceleración (s)"
                        }
                    }
                }
        );
    },

    graficarDummy: function(){
        var name = 'R2-T1';
        var phi = 1.2;
        var beta = 2.35;
        var arg_a0 = 0.265;
        var arg_ta = 0.02;
        var arg_t0 = 0.1;
        var arg_tstar = 0.35;
        var arg_td = 2.6;
        var arg_m = 0;
        var arg_p = 1;

        esp = new Espectro(name, phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);
        $( "#dialog" ).dialog( "open" );
        this.graficarEspectro(esp);
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

        map.events.register('click', map, function(e){
            var params = {
                REQUEST: "GetFeatureInfo",
                EXCEPTIONS: "application/vnd.ogc.gml",
                BBOX: map.getExtent().toBBOX(), //????
                SERVICE: "WMS",
                INFO_FORMAT: 'text/html',
                QUERY_LAYERS: map.layers[0].params.LAYERS,
                FEATURE_COUNT: 50,
                Layers: 'microzonas:Microzonas_Amenaza_General', //'microzonas:Microzonas_Amenaza_General',
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

            $.getJSON('/getmicrozone/', params, function(response){
                //alert(response.responseText);

                var name = response['name'];
                var phi = response['phi'];
                var beta = response['beta'];
                var arg_a0 = response['arg_a0'];
                var arg_ta = response['arg_ta'];
                var arg_t0 = response['arg_t0'];
                var arg_tstar = response['arg_tstar'];
                var arg_td = response['arg_td'];
                var arg_m = response['arg_m'];
                var arg_p = response['arg_p'];

                esp = new Espectro(name, phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);
                $( "#dialog" ).dialog( "open" );
                window.mapping.graficarEspectro(esp);

            });

            e.stopPropagation();
        });
    }
}
