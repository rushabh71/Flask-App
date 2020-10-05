 document.onreadystatechange = function () {
     if (document.readyState == "complete") {
     // document is ready.

	     init();

	     registerListeners();
     	
   }
}

function init(){

 	//Current numbers

 	getCurrentNumbers();

	//World heat map

	showWorldHeat();

	//World plots

	plotWorldConfirmed();
	plotWorldDeceased();
	plotWorldRecovered();
	plotWorldMortality();
	plotWorldTrend();

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

}


function registerListeners(){

	$(function() {
	 $('#wselect').on('change', function() {
	 	var categ = $(this).val();
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
	 $('#dselect').on('change', function() {
	 	var district = $('#dselect').val();
	 	$.post("/district", {"district": district},
		function(response){
			plotDistrictChart(response.district);
		});
	  });
	});


	$(function() {
	 $('#sselect').on('change', function() {
	 	var state = $(this).val();
	 	$.post("/state", {"state": state},
		function(response){
			 plotStateChart(response.state);
		});
		$.post("/update_districts", {"state": state},
		function(response){
			$("#dtable").DataTable().clear().destroy();
			document.getElementById('dselect').innerHTML = '';

			var rows = response.district.district_rows;
			for(var row=0; row<rows.length; row++){
				var row_element = document.createElement("tr");
				for(var val=0; val<rows[row].length; val++){
					if(val==0){
						var val_element = document.createElement("td");
						val_element.setAttribute('class', 'f-col-val');
						val_element.innerHTML = '<b>'+rows[row][val]+'</b>';
						row_element.appendChild(val_element);

						var option = document.createElement("option");
						option.innerHTML = rows[row][val];
						document.getElementById('dselect').appendChild(option);
					} else {
						var val_element = document.createElement("td");
						val_element.innerHTML = rows[row][val];
						row_element.appendChild(val_element);
					}
				}
				document.getElementById('dist_table_body').appendChild(row_element);

				var district = $('#dselect').val();
			 	$.post("/district", {"district": district},
				function(response){
					plotDistrictChart(response.district);
				});
			}

			$('#dtable').DataTable({
		        "order": [[ 1, "desc" ],[ 2, "desc" ]]
		    }); 
		});
	  });
	});



	$(function() {
		$('#wtable').DataTable({
	        "order": [[ 1, "desc" ],[ 2, "desc" ]]
	    });


    	$('#stable').DataTable({
	        "order": [[ 2, "desc" ],[ 3, "desc" ]]
	    });

	    $('#dtable').DataTable({
	        "order": [[ 1, "desc" ],[ 2, "desc" ]]
	    });
	});



	$(function() {
		var state = $('#sselect').val();
	 	$.post("/state", {"state": state},
		function(response){
			plotStateChart(response.state);
		});
	 });


	$(function() {
		var district = $('#dselect').val();
	 	$.post("/district", {"district": district},
		function(response){
			plotDistrictChart(response.district);
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