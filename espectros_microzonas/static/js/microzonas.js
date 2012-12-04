/*
 *
 *
 * */
var Microzonas = function(opt_config){
    var map;
    var handler = function(response){
        alert(response.responseText);
    }

    opt_config = opt_config || {
        // default parameters
    };

    // si no se especifican opciones, se definen unos parámetros por defecto

    return this;
}

Microzonas.prototype.registerMap = function(map, layers, url){
    this.map = map;

    map.events.register('click', map, function (e) {

        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.gml",
            BBOX: map.getExtent().toBBOX(), //????
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: map.layers[0].params.LAYERS,
            FEATURE_COUNT: 50,
            Layers: layers, //'microzonas:Microzonas_Amenaza_General',
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

        // Se puede hacer esta llamada sin OpenLayers <-- ?
        OpenLayers.loadURL(url, params, this, this.handler, this.handler);
        OpenLayers.Event.stop(e);
    });

}