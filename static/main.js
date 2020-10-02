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
	 $('#sselect').on('change', function() {
	 	var state = $(this).val();
	 	$.post("/state", {"state": state},
		function(response){
			 plotStateChart(response.state);
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