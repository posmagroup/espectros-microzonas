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

            var name = response['name'];    // <--- verificar
            var phi = response['phi'];
            var beta = response['beta'];
            var arg_a0 = response['arg_a0'];
            var arg_ta = response['arg_ta'];
            var arg_t0 = response['arg_t0'];
            var arg_tstar = response['arg_tstar'];
            var arg_td = response['arg_td'];
            var arg_m = response['arg_m'];
            var arg_p = response['arg_p'];

            esp = new espectro(name, phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);
            $( "#dialog" ).dialog( "open" );
            esp.graficar("chartdiv");

        });

        e.stopPropagation();

    });
};

var espectro = function(name, phi, beta, A_0, T_A, T_0, T_star, T_D, m, p){
    this.name = name;
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

espectro.prototype.graficar = function(divname){
    $("#mzid").html(this.name);
    $("#val_phi").html(this.phi);
    $("#val_beta").html(this.beta);
    $("#val_a0").html(this.A_0);
    $("#val_m").html(this.m);
    $("#val_p").html(this.p);
    $("#val_t0").html(this.T_0);
    $("#val_ta").html(this.T_A);
    $("#val_td").html(this.T_D);
    $("#val_tstar").html(this.T_star);

    var f_t0 = this.calcular(this.T_0);
    var f_ta = this.calcular(this.T_A);
    var f_tstar = this.calcular(this.T_star);
    var f_td = this.calcular(this.T_D);

    // Faltan los puntos que son


    $.jqplot(divname,  [[[0.01, this.calcular(0.01)], [this.T_A, f_ta], [this.T_0, f_t0], [this.T_star, f_tstar], [this.T_D, f_td]]],
        {
            axesDefaults: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    fontSize: '8pt'
                }
            },
            axes:{
                xaxis:{
                    renderer: $.jqplot.LogAxisRenderer,

                    //label: "Período (s)"
                },
                yaxis:{
                    //label: "Aceleración (s)"
                }
            }
        }
    );

};

var grapficarDummy = function(){
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

    esp = new espectro(name, phi, beta, arg_a0, arg_ta, arg_t0, arg_tstar, arg_td, arg_m, arg_p);
    $( "#dialog" ).dialog( "open" );
    esp.graficar("chartdiv");
};
