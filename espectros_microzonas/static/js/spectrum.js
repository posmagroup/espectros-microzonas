/*
 *
 *
 * */

var Spectrum = function (label, phi, beta, A_0, T_A, T_0, T_star, T_D, m, p) {
    "use strict";

    this.label = label;
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
};

Spectrum.prototype.calculate = function (T) {
    "use strict";

    if (T < this.T_A) {
        return this.phi * this.A_0;
    }

    if (this.T_A <= T && T < this.T_0) {
        return this.phi * this.A_0 * (1 + ((T - this.T_A) * (this.beta - 1) / (this.T_0 - this.T_A)));
    }

    if (this.T_0 <= T && T < this.T_star) {
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / T, this.m);
    }

    if (this.T_star <= T && T < this.T_D) {
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / this.T_star, this.m) * Math.pow(this.T_star / T, this.p);
    }

    if (this.T_D <= T) {
        return this.phi * this.beta * this.A_0 * Math.pow(this.T_0 / this.T_star, this.m) * Math.pow(this.T_star / this.T_D, this.p) * Math.pow(this.T_D / T, 2);
    }

    return false; // error
};

Spectrum.prototype.getPoints = function () {
    "use strict";

    var
        logspace = this.logSpace(),
        points = [],
        i;

    for (i = 0; i < logspace.length; i = i + 1) {
        points.push([logspace[i], this.calculate(logspace[i])]);
    }

    return points;
};

Spectrum.prototype.logSpace = function () {
    "use strict";

    return [
        1.10485435e-02, 1.31975163e-02, 1.57644704e-02, 1.88307043e-02, 2.24933293e-02, 2.68683452e-02, 3.20943141e-02,
        3.83367486e-02, 4.57933542e-02, 5.47002906e-02, 6.53396512e-02, 7.80483975e-02, 9.32290307e-02, 1.11362340e-01,
        1.33022629e-01, 1.58895905e-01, 1.89801606e-01, 2.26718553e-01, 2.70815950e-01, 3.23490415e-01, 3.86410212e-01,
        4.61568087e-01, 5.51344380e-01, 6.58582416e-01, 7.86678551e-01, 9.39689745e-01, 1.12246205e+00, 1.34078408e+00,
        1.60157036e+00, 1.91308031e+00, 2.28517982e+00, 2.72965373e+00, 3.26057907e+00, 3.89477088e+00, 4.65231479e+00,
        5.55720313e+00, 6.63809479e+00, 7.92922293e+00, 9.47147913e+00, 1.13137085e+01
    ];
};