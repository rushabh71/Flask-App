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


function plotWorldConfirmed(){

	var data = [];
	var x = world_df_time['Dates'];

	for(var i=0; i<countries.length; i++){
		var y = world_df_time[countries[i]]['Confirmed'];
		data.push({
			x : x,
			y : y,
			type: 'scatter',
		    name: countries[i],
		});
	}


	var layout = {
	  title: { 
	  	    text: 'Confirmed Cases',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hovermode: 'x unified',
      xaxis: {
      		title: {
      			text: 'Date',
      		},
      		tickmode: 'array',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tickvals: custom_slice(x, 30),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: 'No. of Cases',
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		  },
	  showlegend: true,
	};

	var config = {responsive: true};

	Plotly.newPlot("world_confirmed", data, layout, config, {showLink: false});

}



function plotWorldDeceased(){

	var data = [];
	var x = world_df_time['Dates'];

	for(var i=0; i<countries.length; i++){
		var y = world_df_time[countries[i]]['Deceased'];
		data.push({
			x : x,
			y : y,
			type: 'scatter',
		    name: countries[i],
		});
	}


	var layout = {
	  title: { 
	  	    text: 'Deceased Cases',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hovermode: 'x unified',
      xaxis: {
      		title: {
      			text: 'Date',
      		},
      		tickmode: 'array',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tickvals: custom_slice(x, 30),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: 'No. of Cases',
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		  },
	  showlegend: true,
	};

	var config = {responsive: true};

	Plotly.newPlot("world_deceased", data, layout, config, {showLink: false});

}



function plotWorldRecovered(){

	var data = [];
	var x = world_df_time['Dates'];

	for(var i=0; i<countries.length; i++){
		var y = world_df_time[countries[i]]['Recovered'];
		data.push({
			x : x,
			y : y,
			type: 'scatter',
		    name: countries[i],
		});
	}


	var layout = {
	  title: { 
	  	    text: 'Recovered Cases',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hovermode: 'x unified',
      xaxis: {
      		title: {
      			text: 'Date',
      		},
      		tickmode: 'array',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tickvals: custom_slice(x, 30),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: 'No. of Cases',
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		  },
	  showlegend: true,
	};

	var config = {responsive: true};

	Plotly.newPlot("world_recovered", data, layout, config, {showLink: false});

}



function plotWorldMortality(){

	var data = [];
	var x = world_df_time['Dates'];

	for(var i=0; i<countries.length; i++){
		var y = world_df_time[countries[i]]['Mortality'];
		data.push({
			x : x,
			y : y,
			type: 'scatter',
		    name: countries[i],
		});
	}


	var layout = {
	  title: { 
	  	    text: 'Mortality Rate',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hovermode: 'x unified',
      xaxis: {
      		title: {
      			text: 'Date',
      		},
      		tickmode: 'array',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tickvals: custom_slice(x, 30),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: 'Rate in %',
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		    tickformat: '%',
		  },
	  showlegend: true,
	};

	var config = {responsive: true};

	Plotly.newPlot("world_mortality", data, layout, config, {showLink: false});

}



function plotWorldTrend(){

	var data = [];
	var x = world_trend_x;

	for(var i=0; i<countries.length; i++){
		var y = world_df_time[countries[i]]['Confirmed'];
		data.push({
			x : x,
			y : y,
			type: 'scatter',
		    name: countries[i],
		});
	}

	data.push({
		x : [0, x_two],
		y : [0, y_two],
		type: 'scatter',
	    name: '2 days',
	    hoverinfo: 'skip',
	    mode: 'line',
	    marker: {
	    	color: 'red',
	    },
	    line: {
		    dash: 'dot',
		    width: 2,
		    color: 'gray'
		  }
	});

	data.push({
		x : [0, x_four],
		y : [0, y_four],
		type: 'scatter',
	    name: '4 days',
	    hoverinfo: 'skip',
	    mode: 'line',
	    marker: {
	    	color: 'blue',
	    },
	    line: {
		    dash: 'dot',
		    width: 2,
		    color: 'gray'
		  }
	});

	data.push({
		x : [0, x_seven],
		y : [0, y_seven],
		type: 'scatter',
	    name: '7 days',
	    hoverinfo: 'skip',
	    mode: 'line',
	    marker: {
	    	color: 'green',
	    },
	    line: {
		    dash: 'dot',
		    width: 2,
		    color: 'gray'
		  }
	});

	data.push({
		x : [0, x_ten],
		y : [0, y_ten],
		type: 'scatter',
	    name: '10 days',
	    hoverinfo: 'skip',
	    mode: 'line',
	    marker: {
	    	color: 'black',
	    },
	    line: {
		    dash: 'dot',
		    width: 2,
		    color: 'gray'
		  }
	});

	data.push({
		x : [0, x_twelve],
		y : [0, y_twelve],
		type: 'scatter',
	    name: '12 days',
	    hoverinfo: 'skip',
	    mode: 'line',
	    marker: {
	    	color: 'purple',
	    },
	    line: {
		    dash: 'dot',
		    width: 2,
		    color: 'gray'
		  }
	});



	var layout = {
	  title: { 
	  	    text: 'Cases Doubling Rate',
	    	x: 0.02,
		    y: 0.92
		},
	  paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hovermode: 'x unified',
      xaxis: {
      		title: {
      			text: 'No. of Days Since First Case',
      		},
      		tickmode: 'array',
      		linecolor: 'lightgray',
      		gridcolor: 'lightgray', 
      		tickvals: custom_slice(x, 30),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: 'No. of Cases',
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		  },
	  showlegend: true,
	};

	var config = {responsive: true};

	Plotly.newPlot("world_trend", data, layout, config, {showLink: false});

}







 


 