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
            phi = response['phi'];
            beta = response['beta'];
            arg_a0 = response['arg_a0'];
            arg_ta = response['arg_ta'];
            arg_t0 = response['arg_t0'];
            arg_tstar = response['arg_tstar'];
            arg_td = response['arg_td'];
            arg_m = response['arg_m'];
            arg_p = response['arg_p'];

            esp = new espectro(phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);

            $.jqplot('chartdiv',  [[[0, 0], [arg_ta, esp.calcular(arg_ta)], [arg_t0, esp.calcular(arg_t0)], [arg_tstar, esp.calcular(arg_tstar)], [arg_td, esp.calcular(arg_td)], [10, esp.calcular(10)]]],
                {
                    title:'Espectros elásticos. Modelo de ajuste.',
                    axes:{xaxis:{renderer: $.jqplot.LogAxisRenderer}}
                }
            );
        });

        e.stopPropagation();

    });
};

var espectro = function(phi, beta, A_0, T_A, T_0, T_star, T_D, m, p){

    this.A_0 = A_0;
    this.phi = phi;
    this.beta = beta;
    this.T_A = T_A;
    this.T_0 = T_0;
    this.T_star = T_star;
    this.T_D = T_D;
    this.m = m;
    this.p = p;

    return this;
}

espectro.prototype.calcular = function(T){
    if(T < this.T_A){
        return this.phi * this.A_0;
    }
    if(this.T_A <= T && T < this.T_0){
        return this.phi * this.A_0 * (1 + ((T - this.T_A) * (this.beta - 1) / (this.T_0 - this.T_A)));
    }
    if(this.T_0 <= T && T < this.T_star){
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / T, this.m);
    }
    if(this.T_star <= T && T < this.T_D){
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / this.T_star, this.m) * Math.pow(this.T_star / T, this.p);
    }
    if(this.T_D <= T){
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / this.T_star, this.m) * Math.pow(this.T_star / this.T_D, this.p) * Math.pow(this.T_D / T, 2);
    }

    return false; // error
};