/*
 *
 *
 * */
var Microzonas = function(opt_config){
    var map;

    opt_config = opt_config || {
        //url = ""// default parameters
    };

    // si no se especifican opciones, se definen unos parámetros por defecto
    return this;
};

Microzonas.prototype.registerMap = function(mapa, layers, url){
    this.map = mapa;
    //alert("handler = " + this.handler);
    mapa.events.register('click', mapa, function (e) {

        var params = {
            REQUEST: "GetFeatureInfo",
            EXCEPTIONS: "application/vnd.ogc.gml",
            BBOX: mapa.getExtent().toBBOX(), //????
            SERVICE: "WMS",
            INFO_FORMAT: 'text/html',
            QUERY_LAYERS: mapa.layers[0].params.LAYERS,
            FEATURE_COUNT: 50,
            Layers: layers, //'microzonas:Microzonas_Amenaza_General',
            X: Math.round(e.xy.x),
            Y: Math.round(e.xy.y),
            WIDTH: mapa.size.w,
            HEIGHT: mapa.size.h,
            format: format,
            styles: mapa.layers[0].params.STYLES,
            srs: mapa.layers[0].params.SRS};

        // merge filters
        if(mapa.layers[0].params.CQL_FILTER != null) {
            params.cql_filter = mapa.layers[0].params.CQL_FILTER;
        }
        if(mapa.layers[0].params.FILTER != null) {
            params.filter = mapa.layers[0].params.FILTER;
        }
        if(mapa.layers[0].params.FEATUREID) {
            params.featureid = mapa.layers[0].params.FEATUREID;
        }

        $.getJSON(url, params, function(response){
            //alert(response.responseText);
            for (k in response){
                alert(k + "= " + response[k]);
            }
        });

        e.stopPropagation();

    });

};

Microzonas.prototype.espectro = function(T, A_0, phi, beta, T_A, T_0, T_star, T_D, m, p){
    if(T < T_0){
        return phi * A_0;
    }
    if(T_A <= T < T_0){
        return phi * A_0 * (1 + ((T - T_A) * (beta - 1) / (T_0 - T_A)));
    }
    if(T_0 <= T < T_star){
        return phi * beta * A_0 * Math.pow(T_0 / T, m);
    }
    if(T_star <= T < T_D){
        return phi * beta * A_0 * Math.pow(T_0 / T_star, m) * Math.pow(T_star / T, p);
    }
    if(T_D <= T){
        return phi * beta * A_0 * Math.pow(T_0 / T_star, m) * Math.pow(T_star / T_D, p) * Math.pow(T_D / T, 2);
    }

    return false; // error
}