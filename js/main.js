

function updateChart(){
    updateSolverConf();
    SolveAndPlot();
}

function updateSolverConf(){
    var prad = function (Z) {
        return Z > 150 && Z<800 ? 1 : 0;
    };

    s.setParametersValues({'a':Number($('#current' + 'a').val()), 'b':Number($('#current' + 'b').val()), 'c':Number($('#current' + 'c').val()), 'd':Number($('#current' + 'd').val()), 'I':prad, 'I0':Number($('#current' + 'I0').val()), 'I1':Number($('#current' + 'I1').val())});
    //s.setParametersValues({'a':0.02, 'b':0.2, 'c':-50, 'd':2, 'I':prad, 'Ic':15});
    s.setVariablesInitValues({'v':Number($('#current' + 'v0').val()), 'u':Number($('#current' + 'u0').val()) * Number($('#current' + 'b').val()), 's':0});
    s.parseSystemDefinition();



}


var T = 1000;

    s = new Solver();
    s.dt = 0.25;
    SystemDefinition = function () {

        this.parameters = ['a','b','c','d','I','I0','I1'];
        this.variables = ['v','u','s'];
        this.equations = {
            'Dv':'0.04*v*v+5*v+140-u+I1*I(this.t)+I0',
            'v':'s==1?c:(v>30?30:v)',
            'Du':'a*(b*v-u)',
            'u':'s==1?u+d:u',
            's':'v>=30?1:0'
        };
    }
    s.setSystemDefinition(new SystemDefinition());
    s.parseSystemDefinition();


function SolveAndPlot() {
    s.solve(T);

    $('#chartdiv').html('');
    $('#chartdiv2').html('');

    toPrint = [s.getResultOfVariable('v')];
    toPrint2 = [s.getResultOfVariable('u')];
    drawPhasePlot({v:toPrint[0],u:toPrint2[0]},s.parametersValues);

    v.drawPlots(toPrint,toPrint2,T/s.dt)

};

$(document).ready(function () {
    $('#PPtime').attr('max',T);
    v.createSliders([
        {
            label:'a',
            min:-0.2,
            max:0.02,
            init:0.2
        },
        {
            label:'b',
            min:-1,
            max:0.3,
            init:0.26
        },
        {
            label:'c',
            min:-65,
            max:-45,
            init:-65
        },
        {
            label:'d',
            min:0,
            max:8,
            init:0
        },
        {
            label:'I1',
            min:-100,
            max:100,
            init:2
        },
        {
            label:'I0',
            min:-100,
            max:100,
            init:-0.78
        }
        ,
        {
            label:'u0',
            min:-100,
            max:100,
            init:-70
        }
        ,
        {
            label:'v0',
            min:-100,
            max:100,
            init:-70
        }
    ]);
    updateSolverConf();
    SolveAndPlot();
});

function EMIlist() {

    list = [
        ['typ 1 z maila (bistable)' , 0.015   , 0.2   , -50   , 1.5,0,8,-70 ],
        ['typ 2 z maila' , -0.02   , -1   , -60   , 8,75,5,-63.8 ],
        ['typ 3 z maila ( fast-spiking (FS) )' , 0.2   , 0.26  , -65  , 0 ,-0.78,2,-64.73],
        ['typ 4 z maila ( LTS )' , 0.02   , 0.25  , -65  , 2 ,0,2,-64.73]

    ];

    return list;

}