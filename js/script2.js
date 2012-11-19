I=[];

var Gpars = [];	
	
phaseBounds = {vmin:-100,vmax:40,umin:-100,umax:500};
canvasSize = 400;

function getAllParams (pars) {

params = { pars:pars };

}

function drawCompas () {



		var canvas = document.getElementById('compasCanvas');
      var context = canvas.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 15;
	  
      var startAngle = 1.1 * Math.PI;
      var endAngle = 1.9 * Math.PI;
      var counterClockwise = false;

	  for ( startAngle = 0;startAngle<360;startAngle++)
	  {
      context.beginPath();
      context.arc(x, y, radius, Math.PI*(startAngle/180), Math.PI*((startAngle+1)/180), counterClockwise);
      context.lineWidth = 15;

      // line color
	  sat = 100;
	  var hue = startAngle+90;
      context.strokeStyle = context.fillStyle = 'hsl(' + hue + ', '+sat+'%, 50%)';;
      context.stroke();
	  }
}

function recalculatePhaseBounds(data){

var margin = 0.12;

var max_of_v = Math.max.apply(Math, data.v);
var min_of_v = Math.min.apply(Math, data.v);

vspan = max_of_v- min_of_v;

var max_of_u = Math.max.apply(Math, data.u);
var min_of_u = Math.min.apply(Math, data.u);

uspan = max_of_u- min_of_u;

phaseBounds = {vmin:min_of_v-margin*vspan,
				vmax:max_of_v+margin*vspan,
				umin:min_of_u-margin*uspan,
				umax:max_of_u+margin*uspan};

}

function drawPhasePlot(data,params) {

	if ($('#refreshBounds').attr('checked')=='checked'){
		recalculatePhaseBounds(data);
	}
	
    var canvas = document.getElementById('phaseCanvas');
	$(canvas).attr('width',400);

    var context = canvas.getContext('2d');

    context.beginPath();
	 
	n = data.u.length;
	
	rect = 10;
	
	for (var x=1;x<canvasSize-1;x+=rect) {
	
		for (var y=1;y<canvasSize-1;y+=rect) {
		

			  
			  var v = x2v(x);
			  var u = y2u(y);
			  
			  var ddv = dv(u,v,params);
			  var ddu = du(u,v,params);
			  
			  hue = Math.floor(360*(Math.atan2(ddv,ddu)/(Math.PI*2)));
			  
/*			  
			  var absD = Math.sqrt(ddv*ddv+ddu*ddu);
			  
			  maxAbs = 100;
			  
			  if (absD>maxAbs)
			  {
			  sat = 100;
			  }
			  else
			  {
			  sat = Math.floor((Math.abs(ddu)/maxAbs)*100);
			  }
			  */

			  //hue = x%180+y%180;
			  alpha = Math.atan2(v2xC(ddv),u2yC(ddu));
			  sat = 100
			  context.beginPath();
			  context.moveTo(x,y);
			  context.lineTo(x+rect*Math.sin(alpha),y+rect*Math.cos(alpha));
			  context.strokeStyle = 'hsl(' + hue + ', '+sat+'%, 50%)';
			  context.stroke();
			  
			  context.beginPath();
			  context.rect(x-1, y-1,2, 2);
			  
			  //context.fillStyle = 'hsl(' + hue + ', '+sat+'%, 50%)';
			  context.fillStyle = 'hsl(' + hue + ', '+sat+'%, 50%)';
			  context.fill();
			  
		}	
	
	}
	

	context.beginPath();
	context.strokeStyle = '#f00';
	for (var x=0;x<canvasSize-1;x++) {
	
		context.moveTo(x,Math.round(u2y(vnull(x2v(x),params))));
		context.lineTo(x+1,Math.round(u2y(vnull(x2v(x+1),params))));
	}
	
	for (var y=0;y<canvasSize-1;y++) {
	
		context.moveTo(Math.round(v2x(unull(y2u(y),params))),y);
		context.lineTo(Math.round(v2x(unull(y2u(y+1),params))),y+1);
		
	}	

	context.stroke();
	
	context.beginPath();
	context.strokeStyle = '#000';
	for (i=0;i<(n-1);i++)
	{
	
		if(data.v[i]==params.vpeak)
		{
		context.stroke();
		
		context.beginPath();
		context.strokeStyle = '#059';
		context.moveTo(v2x(data.v[i]),u2y(data.u[i]));
		context.lineTo(v2x(data.v[i+1]),u2y(data.u[i+1]));
		context.stroke();
		
		context.beginPath();
		context.strokeStyle = '#000';
		}
		else
		{
		context.moveTo(v2x(data.v[i]),u2y(data.u[i]));
		context.lineTo(v2x(data.v[i+1]),u2y(data.u[i+1]));
		}
	}
    context.stroke();
	  
}

function u2yC(u) {

	return -1*(canvasSize/(phaseBounds.umax - phaseBounds.umin))*(u);
}

function v2xC(v) {
	x = (canvasSize/(phaseBounds.vmax - phaseBounds.vmin))*(v);

	return x;
}

function v2x(v) {
	x = (canvasSize/(phaseBounds.vmax - phaseBounds.vmin))*(v-phaseBounds.vmin);

	return x;
}

function x2v(x) {

	return (x*((phaseBounds.vmax - phaseBounds.vmin)/400))+phaseBounds.vmin;
}

function u2y(u) {

	return 400-(canvasSize/(phaseBounds.umax - phaseBounds.umin))*(u-phaseBounds.umin);
}

function y2u(y) {

	return (400-y)/(canvasSize/(phaseBounds.umax - phaseBounds.umin))+phaseBounds.umin ;
}

function showData (data,params)
{	
//twovectors2matrix(data.t,data.u),



	//drawPhasePlot(data,params);
	
	$('#chartdiv').html('');
	$('#chartdiv2').html('');
	
	var toPrint = [twovectors2matrix(data.t,data.v)]
		
	if ($('#showU').attr('checked')=='checked'){
		toPrint=[twovectors2matrix(data.t,data.u),twovectors2matrix(data.t,data.v)];
	}
	
	$.jqplot('chartdiv', toPrint  ,
		{
		    axes: {
				xaxis: {
					show: true,
					min:0,
					max:Gpars.T,
					        tickOptions: {
								show: true,         // wether to show the tick (mark and label),
								showLabel:false
							}
				},
				yaxis: {
					// same options as axesDefaults
				},
				x2axis: {
					// same options as axesDefaults
				},
				y2axis: {
					// same options as axesDefaults
				}
			},
		seriesDefaults: {
			markerOptions : {
				show: false,             // wether to show data point markers.
			}
		}
		}
		);
	$.jqplot('chartdiv2',  [twovectors2matrix(data.t,I)],
		{
						    axes: {
				xaxis: {
					show: true,
					min:0,
					max:Gpars.T,
					        tickOptions: {
								show: true,         // wether to show the tick (mark and label),
								
							}
				},
				},
		seriesDefaults: {

			markerOptions : {
				show: false,             // wether to show data point markers.
			}
		}
		}
		);
	//$.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);
}
var local = true;
function updateChart() {


pars = getParsFromSliders();

pars['JSONpulseInf'] = $('#pulses').val();

	if (local)
	{
		showData (calculate(pars,getI()),pars);
	}
	else
	{
	$.ajax({
	   url: 'http://localhost:8080/',
	   crossDomain: true,
	   dataType: 'json',
	   data: pars,
	   success: function(data) {
			showData (data,pars);

	  }
	});
	}
}

function getParsFromSliders() {

newArr ={};

$('.parSlider').each(function(){
newArr[$(this).data('parName')] = Number($(this).val());

});


Gpars = newArr;



return newArr;

}

function twovectors2matrix (v1,v2) {

	if (v1.length == v2.length)
	{

		newArr = [];

		for (i=0;i<v1.length;i++)
		{
			newArr.push([v1[i],v2[i]]);
		}
		
				return newArr;
	}
	else
	{

		return undefined;
	}

}

function createSliders (options) {

$('#sliders').data('params',options);

$.each(options,function(){

opt = $(this)[0];

	$('#sliders').append('<div class="sliderDiv">'+
		opt.label+' : '+'<input class="initval" value="'+opt.init+'" id="current'+opt.label+'"></input>'+
		'	<input class="parSlider" id="slider_'+opt.label+'" type="range" value="'+opt.init+'" min="'+opt.min+'" max="'+opt.max+'"  step="'+((opt.max-opt.min)/200)+'" />'+
		'	<div class="boundsCtrls">min:<input value="'+opt.min+'" id="min'+opt.label+'"></input>max:<input value="'+opt.max+'" id="max'+opt.label+'"></input></div>'+
		'</div>');

	$('#slider_'+opt.label).data('parName',opt.label);
		
	});

	$('.parSlider').change(function(){
		par = $(this).data('parName');
		$('#current'+par).val($(this).val());

		updateChart();

	});

	$('.initval').change(function(){
		par = $(this).next().data('parName');
		
		if($(this).val()>Number($(this).next().attr('max')))
		{
			$(this).next().attr('max',$(this).val());
		}
		
		if($(this).val()<Number($(this).next().attr('min')))
		{
			$(this).next().attr('min',$(this).val());
		}
		
		$(this).next().val($(this).val());

		updateChart();

	});

	$('#sliders').append('<select id="EMIList" name="typ" size="1"></select>');
	
	lll = $('#EMIList');
	
	emiList = EMIlist();
	
	lll.data('EMI',emiList);
		
	$.each(emiList,function(i){
	
		lll.append('<option value="'+i+'">'+$(this)[0]+'</option>');
	
	
	
	});

	lll.change(function(){	
		dat = $(this).data('EMI')[$(this).val()];	
		setEMIpars(dat[1],dat[2],dat[3],dat[4])		
	});

	getParsFromSliders();
	
}

function createInputEditor (init) {

//$('#inputControl').data('params',options);

$('#inputControl').append('<input id="zero" value="0"></input>'+
	'<input id="pulses" value="'+init+'"></input>'+
	'<input id="updateInput" type="button"></input>'
	);

$('#updateInput').click(function(){
		
	n=Math.round(Gpars.T/Gpars.tau);

	pulseInf = jQuery.parseJSON($('#pulses').val());

	newI = [];

	zero = $('#zero').val()

	for (i=0;i<n;i++){
		cur = Number(zero);
		$.each(pulseInf,function(){
			if(i*Gpars.tau>$(this)[1] && i*Gpars.tau< $(this)[2])
				{
				cur += $(this)[0];
				}		
		});
		newI.push(cur);
	}

	I = newI;
	updateChart();
	
});

$('#updateInput').click();
	
}

function setEMIpars(a,b,c,d) {

setParam('a',a);
setParam('b',b);
setParam('c',c);
setParam('d',d);


updateChart();

}

function ones(x,n) {
newArr = [];
	for(i=0;i<n;i++)
	{
		newArr.push(x)
	}
	return newArr;
}

function range(n) {
newArr = [];
	for(i=0;i<n;i++)
	{
		newArr.push(i)
	}
	return newArr;
}

function getI (params) {

	n=Math.round(Gpars.T/Gpars.tau);

	pulseInf = jQuery.parseJSON($('#pulses').val());

	newI = [];

	zero = $('#zero').val()

	for (i=0;i<n;i++){
		cur = Number(zero);
		$.each(pulseInf,function(){
			if(i*Gpars.tau>$(this)[1] && i*Gpars.tau< $(this)[2])
				{
				cur += $(this)[0];
				}		
		});
		newI.push(cur);
	}

	I = newI;	

return I;
}

function createImpuls (tStart,tEnd,maxCurrent,minCurrent) {

Math.round(T/tau);
newI = [];
newI = newI.concat(ones(minCurrent,tStart));
newI = newI.concat(ones(maxCurrent,tEnd-tStart));
newI = newI.concat(ones(minCurrent,n-tEnd));

return newI;



}

function calculate (params,I) {


	
	
	n=Math.round(params.T/params.tau);
	v=ones(-65,n);
	v[0]=-65;
	u=ones(0,n);
	u[0]=params.b*(-65);
    t=ones(0,n);
	

	
	for (i=0;i<n-1;i++)
	{
		v[1+i]=v[i]+params.tau*0.5*(0.04*(v[i])*(v[i])+5*(v[i])-u[i]+140+params.ic*I[i]);
		v[1+i]=v[i]+params.tau*0.5*(0.04*(v[i])*(v[i])+5*(v[i])-u[i]+140+params.ic*I[i]);
		u[1+i]=u[i]+params.tau*(params.a*(params.b*(v[i])-u[i]));
		
		t[1+i]=t[i]+params.tau;
		
		if (v[i+1]>=30)
		{		
			v[i]=30;
			v[i+1]=params.c;
			u[i+1]=u[i]+params.d;
		}
		
		if (u[i+1]>=0)
		{
			u[i+1]=-20;
		}
	}
	
	getAllParams (params) ;
	return {'t': t,'v': v,'u': u};

}

function vnull(v,params) {
	return params.k*(v-params.vr)*(v-params.vt) + params.ic*params.cI;
};
	
function unull(u,params) {
	return (u/params.b)+params.vr;
};	

function dv(u,v,params) {
		return (params.k*(v-params.vr)*(v-params.vt)-u+params.ic*params.cI)/params.C;		

};
	
function du(u,v,params) {

		return params.a*(params.b*(v-params.vr)-u);
};	

function setParam(id,val) {

		$('#current'+id).val(val);
		
		if($('#current'+id).val()>Number($('#current'+id).next().attr('max')))
		{
			$('#current'+id).next().attr('max',$('#current'+id).val());
		}
		
		if($('#current'+id).val()<Number($('#current'+id).next().attr('min')))
		{
			$('#current'+id).next().attr('min',$('#current'+id).val());
		}
		
		$('#current'+id).next().val($('#current'+id).val());


		
};	
	
$(document).ready( function() {


drawCompas();
createSliders([
	{
		label:'a',
		min:0.0,
		max:0.1,
		init:0.02
	},
	{
		label:'b',
		min:-20,
		max:6,
		init:0.2
	},
	{
		label:'c',
		min:-100,
		max:100,
		init:-65
	},
	{
		label:'d',
		min:-200,
		max:200,
		init:6
	}
	,
	{
		label:'ic',
		min:0.1,
		max:10,
		init:1
	}
	,
	{
		label:'T',
		min:100,
		max:10000,
		init:1000
	}
			,
	{
		label:'tau',
		min:0.2,
		max:5,
		init:1
	}
]);



createInputEditor('[[10,200,500]]');

updateChart();


//$.jqplot('chartdiv',  [[[1, 2],[3,5.12],[5,13.1],[7,33.6],[9,85.9],[11,219.9]]]);

});

function EMIlist() {

list=[ ['tonic spiking' ,0.02   ,   0.2  ,   -65  ,    6   ,    14],
       ['phasic spiking' ,0.02   ,   0.25   , -65   ,   6   ,    0.5],
       ['tonic bursting', 0.02    ,  0.2   ,  -50   ,   2     ,  15],
       ['phasic bursting' ,0.02   ,   0.25   , -55 ,    0.05  ,   0.6],
       ['mixed mode' ,0.02    ,  0.2   ,  -55  ,   4   ,     10],
       ['spike frequency adaptation' ,0.01     , 0.2   ,  -65  ,   8    ,    30],
       ['Class 1' , 0.02  ,    -0.1 ,   -55  ,   6     ,   0],
       ['Class 2' , 0.2    ,   0.26 ,   -65   ,  0    ,    0],
       ['spike latency' , 0.02   ,   0.2   ,  -65  ,   6     ,   7],
       ['subthreshold oscillations' ,0.05   ,   0.26  ,  -60  ,   0  ,      0 ],
       ['resonator' ,0.1     ,  0.26 ,   -60 ,    -1   ,    0],
       ['integrator' ,0.02    ,  -0.1   , -55  ,   6    ,    0],
       ['rebound spike', 0.03    ,  0.25  ,  -60  ,   4   ,     0],
       ['rebound burst' ,0.03   ,   0.25   , -52   ,  0   ,     0],
       ['threshold variability' ,0.03   ,   0.25  ,  -60   ,  4   ,     0],
       ['bistability' ,1      ,   1.5  ,   -60  ,   0   ,   -65],
       ['DAP' ,  1    ,   0.2   ,  -60  ,   -21  ,    0],
       ['accomodation', 0.02   ,   1   ,    -55   ,  4    ,    0],
       ['inhibition-induced spiking', -0.02    ,  -1  ,    -60 ,    8 ,       80],
       ['inhibition-induced bursting', -0.026  ,   -1  ,    -45 ,    0 ,       80],
	   ['xxx', -0.002    ,  0.2  ,    -60 ,    8 ,       80]];
	   
	   return list;
	   
}