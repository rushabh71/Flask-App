 document.onreadystatechange = function () {
     if (document.readyState == "complete") {
     // document is ready.

     	var cat = 'Confirmed';
     	var type = 'Cumulative';
     	var c = 0;
     	var cr = 0;

     	//Current numbers

     	getCurrentNumbers();

		//World heat map

		showWorldHeat();

		//Nation heat map

		showNationHeat();

	    //Nation pie chart

		showNationPie();

		//Category Charts

		plotCategoryCharts();
		plotCategoryCharts2();

		//Top 10 state chart

		plotTopStateChart();

		//State pie chart

		plotStatePie();
	   
	    //State tests vs cases

	    plotStateTestCases();



		$(function() {
		 $('#wselect').on('change', function() {
		 	var categ = $(this).val();
			console.log(categ);
			showWorldHeat(categ);
		  });
		});


		$(function() {
		 $('#cselect').on('change', function() {
		 	cat = $(this).val();
		 	type = $('#tselect').val();
			plotCategoryCharts(cat,type,c);
		  });
		});

		$(function() {
		 $('#tselect').on('change', function() {
		 	cat = $('#cselect').val();
		 	type = $(this).val();
			plotCategoryCharts(cat,type,c);
		  });
		});

		$(function() {
		 $('#sselect').on('change', function() {
		 	var state = $(this).val();
		 	$.post("/state", {"state": state},
			function(response){
				 plotStateChart(response.state);
			});
		  });
		});


		$('#wtable').DataTable({
	        "order": [[ 1, "desc" ],[ 2, "desc" ]]
	    });


    	$('#stable').DataTable({
	        "order": [[ 2, "desc" ],[ 3, "desc" ]]
	    });



		$(function() {
			var state = $('#sselect').val();
		 	$.post("/state", {"state": state},
			function(response){
				plotStateChart(response.state);
			});
		 });


		 $('#c_beginning').on('click', function() {
		 	$( "#c_beginning" ).addClass( "active" );
		 	$( "#c_sixty" ).removeClass( "active" );
		 	$( "#c_week" ).removeClass( "active" );
		 	plotCategoryCharts(cat,type,0);
		 	c = 0;
		 });

		  $('#c_sixty').on('click', function() {
		 	$( "#c_sixty" ).addClass( "active" );
		 	$( "#c_beginning" ).removeClass( "active" );
		 	$( "#c_week" ).removeClass( "active" );
		 	plotCategoryCharts(cat,type,1);
		 	c = 1;
		 });

		  $('#c_week').on('click', function() {
		 	$( "#c_week" ).addClass( "active" );
		 	$( "#c_sixty" ).removeClass( "active" );
		 	$( "#c_beginning" ).removeClass( "active" );
		 	plotCategoryCharts(cat,type,2);
		 	c = 2;
		 });


		  $('#cr_beginning').on('click', function() {
		 	$( "#cr_beginning" ).addClass( "active" );
		 	$( "#cr_sixty" ).removeClass( "active" );
		 	$( "#cr_week" ).removeClass( "active" );
		 	plotCategoryCharts2(0);
		 	cr = 0;
		 });

		  $('#cr_sixty').on('click', function() {
		 	$( "#cr_sixty" ).addClass( "active" );
		 	$( "#cr_beginning" ).removeClass( "active" );
		 	$( "#cr_week" ).removeClass( "active" );
		 	plotCategoryCharts2(1);
		 	cr = 1;
		 });

		  $('#cr_week').on('click', function() {
		 	$( "#cr_week" ).addClass( "active" );
		 	$( "#cr_sixty" ).removeClass( "active" );
		 	$( "#cr_beginning" ).removeClass( "active" );
		 	plotCategoryCharts2(2);
		 	cr = 2;
		 });

   }
}


 function plotStateChart(state){

 	formatValue = d3.format(".3s");

 	var data = [{
 	  x: ['Confirmed','Recovered','Active','Deceased'],
 	  y: [state['Confirmed'],state['Recovered'],state['Active'],state['Deceased']],
 	  text: [formatValue(state['Confirmed']),formatValue(state['Recovered']),formatValue(state['Active']),formatValue(state['Deceased'])],
 	  textposition: 'auto',
 	  hoverinfo:"x+y",
	  marker: {
   		color: ['blue', 'green', 'orange', 'gray'],
   	  },
	  type: 'bar',
	}];

	var layout = {
	  title: {
	  	text: 'Total Samples Tested : ' + formatValue(state['Tested']),
	  	x: 0.02,
		y: 0.92
	    },
	  showlegend: false,
	  xaxis: {
	  		title: {
	  			text: 'Categories',
	  		},
	  		linecolor: 'lightgray',
	  		gridcolor: 'lightgray', 
		  },
	  yaxis: {
	  		title: {
	  			text: 'No. of Cases',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },
	  bargap: 0.5,
	};

	var config = {responsive: true}

	Plotly.newPlot('state_chart', data, layout, config);

}




function plotStateTestCases(){

 	var col = [];

	for(var i = 0; i < state_confirmed_full.length; i++){
		 col.push('rgb(' + Math.random(0,255) + ',' + Math.random(0,255) + ',' + Math.random(0,255) + ')');
	}
   
 	var data = [{
 	  x: state_confirmed_full,
 	  y: state_tested_full,
	  type: 'scatter',
	  mode: 'markers',
	  text: state_labels_full,
	  marker: {
	  	color: col,
	  },
	}];

	var layout = {
	  title: {
	  	text: 'Confirmed Cases V/S Samples Tested',
	  	x: 0.02,
		y: 0.92
	    },
	  showlegend: false,
	  xaxis: {
	  		title: {
	  			text: 'Confirmed Cases',
	  		},
	  		linecolor: 'lightgray',
	  		gridcolor: 'lightgray', 
		  },
	  yaxis: {
	  		title: {
	  			text: 'Samples Tested',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },
	};

	var config = {responsive: true}

	Plotly.newPlot('state_test_cases', data, layout, config);

 }


 function plotStatePie(){

 	var data = [{
	  values: state_confirmed,
	  labels: state_labels,
	  domain: {column: 0},
	  name: 'Confirmed',
	  hoverinfo: 'label+percent+name',
	  hole: .4,
	  type: 'pie'
	}];

	var layout = {
	  title: {
	  	text: 'Statewise Confirmed Cases [Top-10]',
	  	x: 0.02,
		y: 0.92
	},
	  showlegend: true,
	};

	var config = {responsive: true}

	Plotly.newPlot('state_pie', data, layout, config);

 }



function plotTopStateChart(){

	var x = state_labels;

	var data = [{
	 	  x: x,
	 	  y: state_confirmed,
	 	  name: 'Confirmed',
		  type: 'bar',
	},{
	 	  x: x,
	 	  y: state_active,
	 	  name: 'Active',
		  type: 'bar',
	},{
	 	  x: x,
	 	  y: state_recovered,
	 	  name: 'Recovered',
		  type: 'bar',
	},{
	 	  x: x,
	 	  y: state_deceased,
	 	  name: 'Deceased',
		  type: 'bar',
	},{
	 	  x: x,
	 	  y: state_tested,
	 	  name: 'Tested',
	 	  yaxis: 'y2',
		  type: 'scatter',
	}];


	var layout = {
	  barmode: 'stack',
	  title: { 
	  	    text: 'Top 10 States With Confirmed Cases',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
	  plot_bgcolor: 'rgba(0,0,0,0)',
	  xaxis: {
	  		title: {
	  			text: 'States',
	  		},
	  		linecolor: 'lightgray',
	  		gridcolor: 'lightgray', 
	  		tickangle: -45, 
	  		automargin: true
		  },
	  yaxis: {
	  		title: {
	  			text: 'No. of Cases',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },
	  yaxis2: {
		   title: {
	  			text: 'No. of Samples',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		    overlaying: 'y',
		    side: 'right'
  		  },
  	  legend: {
		    x: 1.25,
		    y: 0.5,
		  },
		  bargap: 0.5,

	};

	var config = {responsive: true}

	Plotly.newPlot('top_state', data, layout, config);

}


function plotCategoryCharts2(dur=0){

	var x;
	var y;
	var dtick;

	switch(dur){
		case 0:
			x = dates;
			y = positivity_rate;
			dtick = 30;
		break;

		case 1:
			x = dates.slice(-60,);
			y = (positivity_rate).slice(-60,);
			dtick = 10;
		break;

		case 2:
			x = dates.slice(-7,);
			y = (positivity_rate).slice(-7,);
			dtick = 1;
		break;
	}

	var data = [{
	 	  x: x,
	 	  y: y,
		  type: 'scatter',
	}];

	var layout = {
	  title: { 
	  	    text: 'Positivity Rate',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
	  plot_bgcolor: 'rgba(0,0,0,0)',
	  xaxis: {
	  		title: {
	  			text: 'Dates',
	  		},
	  		tickmode: 'linear',
	  		linecolor: 'lightgray',
	  		gridcolor: 'lightgray', 
	  		tick0: '30/01/2020', 
	  		dtick: dtick, 
	  		tickangle: -45, 
	  		automargin: true
		  },
	  yaxis: {
	  		title: {
	  			text: 'Rate in %',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },

	};

	var config = {responsive: true}

	Plotly.newPlot('categ_charts_right1', data, layout, config);


	//cases -pm vs test -pm

	var casespm
	var testspm

	switch(dur){
		case 0:
			x = dates;
			casespm = cases_pm;
			testspm = tests_pm;
			dtick = 30;
		break;

		case 1:
			x = dates.slice(-60,);
			casespm = (cases_pm).slice(-60,);
			testspm = (tests_pm).slice(-60,);
			dtick = 10;
		break;

		case 2:
			x = dates.slice(-7,);
			casespm = (cases_pm).slice(-7,);
			testspm = (tests_pm).slice(-7,);
			dtick = 1;
		break;
	}

	var data = [{
	 	  x: x,
	 	  y: casespm,
	 	  name: 'Cases PM',
		  type: 'scatter',
	}, {

		  x: x,
		  y: testspm,
		  name: 'Tests PM',
		  type: 'scatter',
	}];

	var layout = {
	  title: { 
	  	    text: 'Cases PM V/S Tests PM',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
	  plot_bgcolor: 'rgba(0,0,0,0)',
	  xaxis: {
	  		title: {
	  			text: 'Dates',
	  		},
	  		tickmode: 'linear',
	  		linecolor: 'lightgray',
	  		gridcolor: 'lightgray', 
	  		tick0: '30/01/2020', 
	  		dtick: dtick, 
	  		tickangle: -45, 
	  		automargin: true
		  },
	  yaxis: {
	  		title: {
	  			text: 'Per Million',
	  		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },

	};

	var config = {responsive: true}

	Plotly.newPlot('categ_charts_right2', data, layout, config);

}



function plotCategoryCharts(categ = 'Confirmed', type = 'Cumulative', dur = 0){

	y_data = {
		'Cumulative': {
			'Confirmed' : total_confirmed,
			'Recovered' : total_recovered,
			'Deceased'	: total_deceased,
			'Active'	: total_active,
			'Tested'	: total_tested
		},
		'Daily': {
			'Confirmed' : daily_confirmed,
			'Recovered' : daily_recovered,
			'Deceased'	: daily_deceased,
			'Active'	: daily_active,
			'Tested'	: daily_tested
		},
		'Log': {
			'Confirmed' : total_confirmed_log,
			'Recovered' : total_recovered_log,
			'Deceased'	: total_deceased_log,
			'Active'	: total_active_log,
			'Tested'	: total_tested_log
		}
	}

	y_label = {
			'Cumulative' : 'No. of Cases',
			'Daily'		 : 'No. of Cases',
			'Log'		 : 'Log of cases'
	}

	var x;
	var y;
	var dtick;

	switch(dur){
		case 0:
			x = dates;
			y = y_data[type][categ];
			dtick = 30;
		break;

		case 1:
			x = dates.slice(-60,);
			y = (y_data[type][categ]).slice(-60,);
			dtick = 10;
		break;

		case 2:
			x = dates.slice(-7,);
			y = (y_data[type][categ]).slice(-7,);
			dtick = 1;
		break;
	}

	var data = [{
	 	  x: x,
	 	  y: y,
		  type: 'scatter',
		  fill: 'tonexty',
	}];

	var layout = {
	  title: { 
	  	    text: categ + ' Cases' + ' - ' + type,
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      xaxis: {
      		title: {
      			text: 'Dates',
      		},
      		tickmode: 'linear',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tick0: '30/01/2020', 
      		dtick: dtick, 
      		tickangle: -45, 
      		automargin: true
		  },
	  yaxis: {
	  		title: {
      			text: y_label[type],
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray'
		  },

	};

	var config = {responsive: true}

	Plotly.newPlot('categ_charts', data, layout, config);
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

 function getCurrentNumbers(){
 	document.getElementById("cum_confirmed").innerHTML = formatNumber(numbers['cum_numbers'][0]);
	document.getElementById("cum_recovered").innerHTML = formatNumber(numbers['cum_numbers'][1]);
	document.getElementById("cum_deceased").innerHTML = formatNumber(numbers['cum_numbers'][2]);
	document.getElementById("cum_active").innerHTML = formatNumber(numbers['cum_numbers'][3]);
	document.getElementById("cum_tested").innerHTML = formatNumber(numbers['cum_numbers'][4]);

	document.getElementById("daily_confirmed").innerHTML = formatNumber(numbers['daily_numbers'][0]);
	document.getElementById("daily_recovered").innerHTML = formatNumber(numbers['daily_numbers'][1]);
	document.getElementById("daily_deceased").innerHTML = formatNumber(numbers['daily_numbers'][2]);
	document.getElementById("daily_active").innerHTML = formatNumber(numbers['daily_numbers'][3]);
	document.getElementById("daily_tested").innerHTML = formatNumber(numbers['daily_numbers'][4]);
}


 function showNationPie(){
 	 var data = [{
		  values: npie_cases,
		  labels: npie_labels,
		  hole: .4,
		  type: 'pie',
		}];

		var layout = {
		  title: { 
		  	    text: 'Nationwide Cases Distribution',
		    	x: 0.02,
			    y: 0.92
			},

		};

		var config = {responsive: true}

		Plotly.newPlot('nation_pie', data, layout, config);
 }


 function showWorldHeat(categ = 'Confirmed'){


 	var data = [{
	        type: 'choropleth',
	        locationmode: 'country names',
	        locations: world_heat['countries'],
	        z: world_heat[categ],
	        text: world_heat['countries'],
	        autocolorscale: true,
	        colorbar: {len: 0.5},
	    }];

	    var layout = {
	      title: {
				    text:'World COVID-19 '+ categ + ' Cases',
				    x: 0.02,
				    y: 0.92
				  },
	      margin: {l:10, r:10, b:0, t:60, pad: 0}
	    };

	    Plotly.newPlot("world_heat", data, layout, {showLink: false});
 }


 function showNationHeat(){

 	var data = [{
 		type: 'choropleth',
 		geojson : "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson",
	    featureidkey : 'properties.ST_NM',
	    locationmode : 'geojson-id',
	    locations : df_state['State'],
	    z : df_state['Confirmed'],
	    autocolorscale : true,
	    colorbar : {
	    	thickness : 15,
	        len : 0.35,
	        bgcolor : 'rgba(255,255,255,0.6)',

	        tick0 : 0,
	        dtick : 200000,

	        xanchor : 'left',
	        x : 0.8,
	        yanchor : 'bottom',
	        y : 0.1
	      }
	    }];



     var layout = {
     	title: {
			    text: 'INDIA - Confirmed Cases',
			    x: 0.02,
			    y: 0.92
			  },
	    margin : {'r': 0, 't': 60, 'l': 0, 'b': 0},
	    title_x : 0.5,

	    geo: {
	    	visible : false,
            lonaxis : {'range': [68, 98]},
	        lataxis : {'range': [6, 38]},
            projection: {
                type : 'conic conformal',
		        parallels : [12.472944444, 35.172805555556],
		        rotation : {'lat': 24, 'lon': 80}
            },
        },
    };

    var config = {responsive: true}


	Plotly.newPlot("nheat", data, layout, config, {showLink: false});

 }



/*
 $(function() {
	 $('#wselect').on('change', function() {
	 	var categ = $(this).val();
		console.log(categ);
		$.post("/change_wheat", {"categ": categ},
			function(response){
				alert(response.categ);
			});
	  });
	});

*/