
/********************************************************
*														*
* 	Step0: Load data from json file						*
*														*
********************************************************/
d3.json("data/culture-movies.json", function (yelp_data) {
	
/********************************************************
*														*
* 	Step1: Create the dc.js chart objects & ling to div	*
*														*
********************************************************/
var volumeChart = dc.barChart("#dc-volume-chart");


/********************************************************
*														*
* 	Step2:	Run data through crossfilter				*
*														*
********************************************************/
var ndx = crossfilter(yelp_data);
	
/********************************************************
*														*
* 	Step3: 	Create Dimension that we'll need			*
*														*
********************************************************/

	// for pieChart
    var startValue = ndx.dimension(function (d) {
		return d.year;
    });
    var startValueGroup = startValue.group();

/********************************************************
*														*
* 	Step4: Create the Visualisations					*
*														*
********************************************************/

volumeChart.width(800)
            .height(200)
            .dimension(startValue)
            .group(startValueGroup)
			.transitionDuration(1500)
            .centerBar(true)	
			.gap(3)
            .x(d3.scale.linear().domain([1900, 2020]))
			.elasticY(true)
			// .xAxis().tickFormat(function(v) {return v;});	

/********************************************************
*														*
* 	Step6: 	Render the Charts							*
*														*
********************************************************/
			
	dc.renderAll();
});
