
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

	var color = {
		'Confirmed' : '#5891e0',
		'Recovered' : '#61e655',
		'Deceased'	: 'ff7363',
		'Active'	: '#e6ca30',
		'Tested'	: '#e04ac0'
	}

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


	var trace1 = {
	 	  x: x,
	 	  y: y,
		  type: 'scatter',
		  fill: 'tonexty',
		  fillcolor: color[categ],
		  line: {
		  	color: 'gray',
		  },
		  name: 'Confirmed',
	};

	var trace2 = {
	 	  x: [x[x.length-1]],
	 	  y: [y[y.length-1]],
		  type: 'scatter',
		  mode: 'markers+text',
		  text: [formatNumber(y[y.length-1])],
		  marker: {
		  	color: 'gray',
		  },
		  textposition: "top center",
		  hoverinfo: 'skip',
	};

	var data = [trace1, trace2];

	var layout = {
	  title: { 
	  	    text: categ + ' Cases' + ' - ' + type,
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
      		tickvals: custom_slice(x, dtick),
      		tickangle: -45, 
      		automargin: true,
		  },
	  yaxis: {
	  		title: {
      			text: y_label[type],
      		},
		    linecolor: 'lightgray',
		    gridcolor: 'lightgray',
		  },
	  showlegend: false
	};

	var config = {responsive: true}

	Plotly.newPlot('categ_charts', data, layout, config);
}

 

function plotCategoryCharts2(dur=0){

	var x;
	var pos;
	var mor;
	var dtick;

	switch(dur){
		case 0:
			x = dates;
			pos = positivity_rate;
			mor = mortality_rate;
			dtick = 30;
		break;

		case 1:
			x = dates.slice(-60,);
			pos = (positivity_rate).slice(-60,);
			mor = (mortality_rate).slice(-60,);
			dtick = 10;
		break;

		case 2:
			x = dates.slice(-7,);
			pos = (positivity_rate).slice(-7,);
			mor = (mortality_rate).slice(-7,);
			dtick = 1;
		break;
	}

	var trace1 = {
 		  x: x,
	 	  y: pos,
		  type: 'scatter',
		  name: 'Positivity Rate'
	};

	var trace2 = {
 		  x: x,
	 	  y: mor,
		  type: 'scatter',
		  name: 'Mortality Rate'
	};

	var trace3 = {
	 	  x: [x[x.length-1]],
	 	  y: [pos[pos.length-1]],
		  type: 'scatter',
		  mode: 'markers+text',
		  text: [pos[pos.length-1]],
		  marker: {
		  	color: 'blue',
		  },
		  textposition: "top center",
		  hoverinfo: 'skip',
	};

	var trace4 = {
	 	  x: [x[x.length-1]],
	 	  y: [mor[mor.length-1]],
		  type: 'scatter',
		  mode: 'markers+text',
		  text: [mor[mor.length-1]],
		  marker: {
		  	color: 'orange',
		  },
		  textposition: "top center",
		  hoverinfo: 'skip',
	};


	var data = [trace1,trace2,trace3,trace4];

	var layout = {
	  title: { 
	  	    text: 'Positivity Rate V/S Mortality Rate',
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
	  		tickvals: custom_slice(x, dtick),
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
	  showlegend: false,

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

	var trace1 = {
	 	  x: x,
	 	  y: casespm,
	 	  name: 'Cases PM',
		  type: 'scatter',
		  name: 'Cases PM',
	};


	var trace2 = {
		  x: x,
		  y: testspm,
		  name: 'Tests PM',
		  type: 'scatter',
		  name: 'Tests PM',
	};


	var trace3 = {
	 	  x: [x[x.length-1]],
	 	  y: [casespm[casespm.length-1]],
		  type: 'scatter',
		  mode: 'markers+text',
		  text: [formatNumber(casespm[casespm.length-1])],
		  marker: {
		  	color: 'blue',
		  },
		  textposition: "top center",
		  hoverinfo: 'skip',
	};


	var trace4 = {
	 	  x: [x[x.length-1]],
	 	  y: [testspm[testspm.length-1]],
		  type: 'scatter',
		  mode: 'markers+text',
		  text: [formatNumber(testspm[testspm.length-1])],
		  marker: {
		  	color: 'orange',
		  },
		  textposition: "top center",
		  hoverinfo: 'skip',
	};

	var data = [trace1, trace2, trace3, trace4];

	var layout = {
	  title: { 
	  	    text: 'Cases PM V/S Tests PM',
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
	  		tickvals: custom_slice(x,dtick),
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
	  showlegend: false,

	};

	var config = {responsive: true}

	Plotly.newPlot('categ_charts_right2', data, layout, config);

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
	 	  marker: {
	 	  	color: 'rgb(128, 0, 128)',
	 	  },
	 	  line: {
	 	  	color: 'rgb(128, 0, 128)',
	 	  },
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
	  hovermode: 'x unified',
	  xaxis: {
	  		title: {
	  			text: 'State',
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
	  shapes: [{
	    type: 'line',
	    x0: state_confirmed_avg,
	    y0: 0,
	    x1: state_confirmed_avg,
	    yref: 'paper',
	    y1: 1,
	    line: {
	      color: 'grey',
	      width: 1.5,
	      dash: 'dot'
	    }
	  }, {
	    type: 'line',
	    x0: 0,
	    y0: state_tested_avg,
	    x1: 1,
	    xref: 'paper',
	    y1: state_tested_avg,
	    line: {
	      color: 'grey',
	      width: 1.5,
	      dash: 'dot'
	    }
	  }]
	};

	var config = {responsive: true}

	Plotly.newPlot('state_test_cases', data, layout, config);

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
   	  showlegend: false,
	  type: 'bar',
	}, {
	  x: ['Confirmed','Recovered','Active','Deceased'],
 	  y: [state_confirmed_avg,state_recovered_avg,state_active_avg,state_deceased_avg],
 	  text: [formatValue(state_confirmed_avg),formatValue(state_recovered_avg),formatValue(state_active_avg),formatValue(state_deceased_avg)],
 	  textposition: 'auto',
 	  hoverinfo:"x+y",
 	  line: {
	    color: 'rgb(128, 0, 128)',
	    width: 3
	  },
	  name: 'State Average',
	  marker: {
	    color: 'rgb(128, 0, 128)',
	    size: 8
	  },
	  type: 'scatter',
	}];

	var layout = {
	  title: {
	  	text: 'Total Samples Tested : ' + formatValue(state['Tested']),
	  	x: 0.02,
		y: 0.92
	    },
	  showlegend: true,
	  hovermode: 'x unified',
	  xaxis: {
	  		title: {
	  			text: 'Category',
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



function plotDistrictChart(district = null){

 	formatValue = d3.format(".3s");

 	var district_confirmed_avg = district['district_confirmed_avg'];
 	var district_recovered_avg = district['district_recovered_avg'];
 	var district_active_avg = district['district_active_avg'];
 	var district_deceased_avg = district['district_deceased_avg'];

 	if(district['Tested']!=null && district['Tested'] > 0){
 		var tested = formatValue(district['Tested']);
 	} else {
 		var tested = 0;
 	}
 	
 	if(district['Confirmed'] > 0){
 		var confirmed = formatValue(district['Confirmed']);
 	}else {
 		var confirmed = 0;
 	} 
 	if(district['Recovered'] > 0){
 		var recovered = formatValue(district['Recovered']);
 	}else {
 		var recovered = 0;
 	} 
 	if(district['Active'] > 0){
 		var active = formatValue(district['Active']);
 	}else {
 		var active = 0;
 	} 
 	if(district['Deceased'] > 0){
 		var deceased = formatValue(district['Deceased']);
 	}else {
 		var deceased = 0;
 	} 


 	var data = [{
 	  x: ['Confirmed','Recovered','Active','Deceased'],
 	  y: [district['Confirmed'],district['Recovered'],district['Active'],district['Deceased']],
 	  text: [confirmed, recovered, active, deceased],
 	  textposition: 'auto',
 	  hoverinfo:"x+y",
	  marker: {
   		color: ['blue', 'green', 'orange', 'gray'],
   	  },
   	  showlegend: false,
	  type: 'bar',
	}, {
	  x: ['Confirmed','Recovered','Active','Deceased'],
 	  y: [district_confirmed_avg,district_recovered_avg,district_active_avg,district_deceased_avg],
 	  text: [formatValue(district_confirmed_avg),formatValue(district_recovered_avg),formatValue(district_active_avg),formatValue(district_deceased_avg)],
 	  textposition: 'auto',
 	  hoverinfo:"x+y",
 	  line: {
	    color: 'rgb(128, 0, 128)',
	    width: 3
	  },
	  name: 'District Average',
	  marker: {
	    color: 'rgb(128, 0, 128)',
	    size: 8
	  },
	  type: 'scatter',
	}];

	var layout = {
	  title: {
	  	text: 'Total Samples Tested : ' + tested,
	  	x: 0.02,
		y: 0.92
	    },
	  showlegend: true,
	  hovermode: 'x unified',
	  xaxis: {
	  		title: {
	  			text: 'Category',
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

	Plotly.newPlot('district_chart', data, layout, config);

}




