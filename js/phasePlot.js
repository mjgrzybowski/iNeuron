phaseBounds = {vmin:-100, vmax:40, umin:-100, umax:500};
canvasSize = 400;

function drawCompas() {


    var canvas = document.getElementById('compasCanvas');
    var context = canvas.getContext('2d');
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var radius = 15;

    var startAngle = 1.1 * Math.PI;
    var endAngle = 1.9 * Math.PI;
    var counterClockwise = false;

    for (startAngle = 0; startAngle < 360; startAngle++) {
        context.beginPath();
        context.arc(x, y, radius, Math.PI * (startAngle / 180), Math.PI * ((startAngle + 1) / 180), counterClockwise);
        context.lineWidth = 15;

        // line color
        sat = 100;
        var hue = startAngle + 90;
        context.strokeStyle = context.fillStyle = 'hsl(' + hue + ', ' + sat + '%, 50%)';
        ;
        context.stroke();
    }
}

function recalculatePhaseBounds(data) {

    var margin = 0.12;

    var max_of_v = Math.max.apply(Math, data.v);
    var min_of_v = Math.min.apply(Math, data.v);

    vspan = max_of_v - min_of_v;

    var max_of_u = Math.max.apply(Math, data.u);
    var min_of_u = Math.min.apply(Math, data.u);

    uspan = max_of_u - min_of_u;

    phaseBounds = {vmin:min_of_v - margin * vspan,
        vmax:max_of_v + margin * vspan,
        umin:min_of_u - margin * uspan,
        umax:max_of_u + margin * uspan};

}

function drawPhasePlot(data, params) {
    t = Number($('#PPtime').val());
    if ($('#refreshBounds').attr('checked') == 'checked') {
        recalculatePhaseBounds(data);
    }


    var canvas = document.getElementById('phaseCanvas');
    $(canvas).attr('width', 400);

    var context = canvas.getContext('2d');

    context.beginPath();

    n = data.u.length;

    rect = 10;

    for (var x = 1; x < canvasSize - 1; x += rect) {

        for (var y = 1; y < canvasSize - 1; y += rect) {


            var v = x2v(x);
            var u = y2u(y);

            var ddv = dv(u, v, params,t);
            var ddu = du(u, v, params,t);

            hue = Math.floor(360 * (Math.atan2(ddv, ddu) / (Math.PI * 2)));


            alpha = Math.atan2(v2xC(ddv), u2yC(ddu));
            sat = 100
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + rect * Math.sin(alpha), y + rect * Math.cos(alpha));
            context.strokeStyle = 'hsl(' + hue + ', ' + sat + '%, 50%)';
            context.stroke();

            context.beginPath();
            context.rect(x - 1, y - 1, 2, 2);


            context.fillStyle = 'hsl(' + hue + ', ' + sat + '%, 50%)';
            context.fill();

        }

    }


    context.beginPath();
    context.strokeStyle = '#f00';
    for (var x = 0; x < canvasSize - 1; x++) {

        context.moveTo(x, Math.round(u2y(vnull(x2v(x), params,t))));
        context.lineTo(x + 1, Math.round(u2y(vnull(x2v(x + 1), params,t))));
    }

    for (var y = 0; y < canvasSize - 1; y++) {

        context.moveTo(Math.round(v2x(unull(y2u(y), params,t))), y);
        context.lineTo(Math.round(v2x(unull(y2u(y + 1), params,t))), y + 1);

    }

    context.stroke();

    context.beginPath();
    context.strokeStyle = '#000';
    for (i = 0; i < (n - 1); i++) {

        if (data.v[i] == 30) {
            context.stroke();

            context.beginPath();
            context.strokeStyle = '#059';
            context.moveTo(v2x(data.v[i]), u2y(data.u[i]));
            context.lineTo(v2x(data.v[i + 1]), u2y(data.u[i + 1]));
            context.stroke();

            context.beginPath();
            context.strokeStyle = '#000';
        }
        else {
            context.moveTo(v2x(data.v[i]), u2y(data.u[i]));
            context.lineTo(v2x(data.v[i + 1]), u2y(data.u[i + 1]));
        }
    }
    context.stroke();

}

function u2yC(u) {

    return -1 * (canvasSize / (phaseBounds.umax - phaseBounds.umin)) * (u);
}

function v2xC(v) {
    x = (canvasSize / (phaseBounds.vmax - phaseBounds.vmin)) * (v);

    return x;
}

function v2x(v) {
    x = (canvasSize / (phaseBounds.vmax - phaseBounds.vmin)) * (v - phaseBounds.vmin);

    return x;
}

function x2v(x) {

    return (x * ((phaseBounds.vmax - phaseBounds.vmin) / 400)) + phaseBounds.vmin;
}

function u2y(u) {

    return 400 - (canvasSize / (phaseBounds.umax - phaseBounds.umin)) * (u - phaseBounds.umin);
}

function y2u(y) {

    return (400 - y) / (canvasSize / (phaseBounds.umax - phaseBounds.umin)) + phaseBounds.umin;
}


//'Dv':'0.04*v*v+5*v+140-u+I1*I(this.t)+I0',
//    'v':'s==1?c:(v>30?30:v)',
//    'Du':'a*(b*v-u)',

function vnull(v, params,t) {
    return 0.04*v*v+5*v+140+params.I1*params.I(t)+params.I0;
}


function unull(u, params,t) {
    return u/params.b;
}


function dv(u, v, params,t) {
    return 0.04*v*v+5*v+140-u+params.I1*params.I(t)+params.I0;

}


function du(u, v, params,t) {

    return params.a*(params.b*v-u);
}
