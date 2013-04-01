
var microzonelib = (function(){

    /**
     * Private atributes and methods of the microzonelib object
     */
    var current_microzone = "";

    var config = {
        geoserver_url : 'http://192.168.0.102:8080/geoserver/Microzonas/wms',
        parameters_service : '/getmicrozone/',
        microzone_layers : [
            ['Laderas', 'Microzonas:Microzonas_Laderas', 'Amenaza'],
            ['Sedimentos', 'Microzonas:Microzonas_Sedimentos', 'microzona'],
            ['Amenaza General', 'Microzonas:Microzonas_Amenaza_General', 'Microzonas']
        ],
        map_div : 'map',
        dialog_div : 'dialog',
        chartdiv : 'chartdiv'
    };

    var display_map = function(mapdiv){
        var div_id = (mapdiv)? mapdiv : config.map_div;

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

        var map = new OpenLayers.Map(div_id, options);

        var wms_3 = new OpenLayers.Layer.WMS( config.microzone_layers[0][0],
                config.geoserver_url,
                {
                    layers: config.microzone_layers[0][1],
                    format: "image/png",
                    transparent: "true"
                    //0x85C247,
                },
                {isBaseLayer: false});

        var wms_2 = new OpenLayers.Layer.WMS( config.microzone_layers[1][0],
                config.geoserver_url,
                {
                    layers: config.microzone_layers[1][1],
                    format: "image/png",
                    style: "",
                    transparent: "true"
                    // 0x886744
                },
                {isBaseLayer: false});

        var wms_1 = new OpenLayers.Layer.WMS( config.microzone_layers[2][0],
                config.geoserver_url,
                {
                    layers: config.microzone_layers[2][1],
                    format: "image/png",
                    transparent: "true"
                },
                {isBaseLayer: true}
        );

        map.addLayers([wms_1, wms_2, wms_3]);

        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.Navigation());
        map.zoomToExtent(bounds);

        return map;
    };

    var get_full_microzone_id = function(slope_value){
        slope_value = (slope_value)? slope_value : 'T0';

        if(current_microzone[0] == 'R'){
            return current_microzone + '-' + slope_value;
        }else{
            return current_microzone;
        }

    };

    var map_click_handler = function(response){

        //microzone_ = response.features[0]; // Expo for debugging
        var microzone_name = response.features[0].id.split('.')[0];

        var field_name;
        for(var i = 0; i < config.microzone_layers.length; i++){
            if(config.microzone_layers[i][1].indexOf(microzone_name) !== -1){
                field_name = config.microzone_layers[i][2];
                break;
            }
        }
        current_microzone = response.features[0].properties[field_name];    //updates global zone id
        var microzone_id = get_full_microzone_id();  // uses default slope (T0)
        request_zone_attributes(microzone_id);  // requests the microzone attributes
    }

    var request_zone_attributes = function(microzone_id){
        $.getJSON(config.parameters_service, {label: microzone_id}, function(response){

            var label = response['label'];
            var phi = response['phi'];
            var beta = response['beta'];
            var arg_a0 = response['arg_a0'];
            var arg_ta = response['arg_ta'];
            var arg_t0 = response['arg_t0'];
            var arg_tstar = response['arg_tstar'];
            var arg_td = response['arg_td'];
            var arg_m = response['arg_m'];
            var arg_p = response['arg_p'];

            if(current_microzone[0] == 'R'){
                $('#slope_div').show();
            }else{
                $('#slope_div').hide();
            }

            esp = new Spectrum(label, phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);
            $( "#"+config.dialog_div ).dialog( "open" );
            plot_spectrum(esp);
        });
    };

    var plot_spectrum = function(espectro){
        $("#mzid").html(espectro.label);
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

        $.jqplot(config.chartdiv,  [points],
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
                            tickOptions:{
                                formatString:'%.3f'
                            }
                        }
                    },

                    cursor: {
                        show: true
                    }
                }
        );
    };


    /**
     * Public methods of the microzonelib object
     */
    return {
        init : function(new_config){
            config = (new_config)? new_config: config;

            var map = display_map();

            map.events.register('click', map, function(e){

                var query_layers = map.layers.map(
                        function(element){
                            return element.params.LAYERS;
                        }
                ).join();
                // As the WMS GetFeatureInfo specs tell about the QUERY_LAYERS GET
                // parameter, it is a "Comma-separated list of one or more layers to
                // be queried" - OpenGIS Web Map Service (WMS) Implementation
                // Specification, page 38 -
                // http://portal.opengeospatial.org/files/?artifact_id=14416

                var params = {
                    REQUEST: "GetFeatureInfo",
                    EXCEPTIONS: "application/vnd.ogc.gml",
                    BBOX: map.getExtent().toBBOX(), //????
                    SERVICE: "WMS",
                    INFO_FORMAT: 'application/json',
                    QUERY_LAYERS: query_layers,
                    FEATURE_COUNT: 50,
                    Layers: query_layers,
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

                $("#slope_select option[value=T0]").attr("selected",true);

                $.getJSON(config.geoserver_url, params, map_click_handler);

                e.stopPropagation();
            });

            //slope selection onChange event
            $('#slope_select').change(function(){
                var selected_slope = $('#slope_select option:selected').val();
                request_zone_attributes(get_full_microzone_id(selected_slope));
            });
        }
    };
})();
