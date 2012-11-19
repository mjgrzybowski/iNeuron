v = {
    createSliders:function (options) {

        $('#sliders').data('params', options);

        $.each(options, function () {

            opt = $(this)[0];

            $('#sliders').append('<div class="sliderDiv">' +
                opt.label + ' : ' + '<input class="initval" value="' + opt.init + '" id="current' + opt.label + '"></input>' +
                '	<input class="parSlider" id="slider_' + opt.label + '" type="range" value="' + opt.init + '" min="' + opt.min + '" max="' + opt.max + '"  step="' + ((opt.max - opt.min) / 200) + '" />' +
                '	<div class="boundsCtrls">min:<input value="' + opt.min + '" id="min' + opt.label + '"></input>max:<input value="' + opt.max + '" id="max' + opt.label + '"></input></div>' +
                '</div>');

            $('#slider_' + opt.label).data('parName', opt.label);

        });

        $('.parSlider').change(function () {
            par = $(this).data('parName');
            $('#current' + par).val($(this).val());
            updateChart();

        });

        $('.initval').change(function () {
            par = $(this).next().data('parName');

            if ($(this).val() > Number($(this).next().attr('max'))) {
                $(this).next().attr('max', $(this).val());
            }

            if ($(this).val() < Number($(this).next().attr('min'))) {
                $(this).next().attr('min', $(this).val());
            }

            $(this).next().val($(this).val());

            updateChart();

        });

        $('#sliders').append('<select id="EMIList" name="typ" size="1"></select>');

        lll = $('#EMIList');

        emiList = EMIlist();

        lll.data('EMI', emiList);

        $.each(emiList, function (i) {

            lll.append('<option value="' + i + '">' + $(this)[0] + '</option>');


        });

        lll.change(function () {
            dat = $(this).data('EMI')[$(this).val()];
            $('#current' + 'a').val(dat[1]);
            $('#current' + 'b').val(dat[2]);
            $('#current' + 'c').val(dat[3]);
            $('#current' + 'd').val(dat[4]);
            $('#current' + 'I0').val(dat[5]);
            $('#current' + 'I1').val(dat[6]);
            $('#current' + 'u0').val(dat[7]);
            $('#current' + 'v0').val(dat[7]);
            updateSolverConf();
            SolveAndPlot();
        });

        //getParsFromSliders();


    },
    drawPlots : function(data1,data2,T)
{
    $.jqplot('chartdiv', data1,
        {
            axes:{
                xaxis:{
                    show:true,
                    min:0,
                    max:T,
                    tickOptions:{
                        show:true, // wether to show the tick (mark and label),
                        showLabel:false
                    }
                },
                yaxis:{
                    // same options as axesDefaults
                },
                x2axis:{
                    // same options as axesDefaults
                },
                y2axis:{
                    // same options as axesDefaults
                }
            },
            seriesDefaults:{
                markerOptions:{
                    show:false, // wether to show data point markers.
                }
            }
        }
    );

    $.jqplot('chartdiv2', data2,
        {
            axes:{
                xaxis:{
                    show:true,
                    min:0,
                    max:T,
                    tickOptions:{
                        show:true, // wether to show the tick (mark and label),
                        showLabel:false
                    }
                },
                yaxis:{
                    // same options as axesDefaults
                },
                x2axis:{
                    // same options as axesDefaults
                },
                y2axis:{
                    // same options as axesDefaults
                }
            },
            seriesDefaults:{
                markerOptions:{
                    show:false, // wether to show data point markers.
                }
            }
        }
    );
}

}