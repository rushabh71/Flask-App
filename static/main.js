 document.onreadystatechange = function () {
     if (document.readyState == "complete") {
     // document is ready.

     	//Current numbers

     	getCurrentNumbers();

		//World heat map

		showWorldHeat();

		//Nation heat map

		showNationHeat();

	    //Nation pie chart

		showNationPie();
	   


		$(function() {
		 $('#wselect').on('change', function() {
		 	var categ = $(this).val();
			console.log(categ);
			showWorldHeat(categ);
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
		  type: 'pie'
		}];

		var layout = {
		  title: 'Nationwide Cases Distribution',
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
			    text: 'Cases Concentration By Statewise',
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