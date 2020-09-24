 document.onreadystatechange = function () {
     if (document.readyState == "complete") {
     // document is ready. Do your stuff here

     	//Current numbers

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


		//World heat map

		var data = [{
	        type: 'choropleth',
	        locationmode: 'country names',
	        locations: world_heat['countries'],
	        z: world_heat['confirmed'],
	        text: world_heat['countries'],
	        autocolorscale: true,
	        colorbar: {len: 0.5},
	    }];

	    var layout = {
	      title: {
				    text:'World COVID-19 Confirmed Cases',
				    x: 0.05,
				    y: 0.92
				  },
	      width: 825,
	      height: 650,
	      margin: {l:0, r:0, b:0, t:0, pad: 0}
	    };

	    Plotly.newPlot("world_heat", data, layout, {showLink: false});


	    //Nation pie chart

	    var data = [{
		  values: npie_cases,
		  labels: npie_labels,
		  type: 'pie'
		}];

		var layout = {
		  title: 'Nationwide Cases Distribution',
		  height: 400,
		  width: 400
		};

		Plotly.newPlot('nation_pie', data, layout);



   }
 }