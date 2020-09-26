 document.onreadystatechange = function () {
     if (document.readyState == "complete") {
     // document is ready.

     	var cat = 'Confirmed';
     	var type = 'Cumulative';

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
			plotCategoryCharts(cat,type);
		  });
		});

		$(function() {
		 $('#tselect').on('change', function() {
		 	cat = $('#cselect').val();
		 	type = $(this).val();
			plotCategoryCharts(cat,type);
		  });
		});


		$('#wtable').DataTable({
	        "order": [[ 1, "desc" ],[ 2, "desc" ]]
	    });


    	$('#stable').DataTable({
	        "order": [[ 2, "desc" ],[ 3, "desc" ]]
	    });


   }
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
		    x: 1,
		    y: 1.25,
		  },

	};

	var config = {responsive: true}

	Plotly.newPlot('top_state', data, layout, config);

}


function plotCategoryCharts2(){

	var x = dates;
	var y = positivity_rate;

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
	  		dtick: 30, 
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

	var data = [{
	 	  x: x,
	 	  y: cases_pm,
	 	  name: 'Cases PM',
		  type: 'scatter',
	}, {

		  x: x,
		  y: tests_pm,
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
	  		dtick: 30, 
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



function plotCategoryCharts(categ = 'Confirmed', type = 'Cumulative'){

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


	var x = dates;

	var data = [{
	 	  x: x,
	 	  y: y_data[type][categ],
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
      		dtick: 30, 
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


 function getCurrentNumbers(){
 	document.getElementById("cum_confirmed").innerHTML = numbers['cum_numbers'][0];
	document.getElementById("cum_recovered").innerHTML = numbers['cum_numbers'][1];
	document.getElementById("cum_deceased").innerHTML = numbers['cum_numbers'][2];
	document.getElementById("cum_active").innerHTML = numbers['cum_numbers'][3];
	document.getElementById("cum_tested").innerHTML = numbers['cum_numbers'][4];

	document.getElementById("daily_confirmed").innerHTML = numbers['daily_numbers'][0];
	document.getElementById("daily_recovered").innerHTML = numbers['daily_numbers'][1];
	document.getElementById("daily_deceased").innerHTML = numbers['daily_numbers'][2];
	document.getElementById("daily_active").innerHTML = numbers['daily_numbers'][3];
	document.getElementById("daily_tested").innerHTML = numbers['daily_numbers'][4];
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
		  annotations: [
			    {
			      font: {
			        size: 20
			      },
			      showarrow: false,
			      text: 'INDIA',
			      x: 0.5,
			      y: 0.5
			    },]

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