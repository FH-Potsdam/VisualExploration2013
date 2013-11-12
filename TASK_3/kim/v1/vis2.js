
/********************************************************
*														*
* 	Step0: Load data from json file						*
*														*
********************************************************/
d3.json("data/culture-movies.json", function (data) {
	
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
var ndx = crossfilter(data);
	
/********************************************************
*														*
* 	Step3: 	Create Dimension that we'll need			*
*														*
********************************************************/

    var years = ndx.dimension(function (d) {
		return d.year;
    });

    var yearsGroup = years.group();

    var colors = ndx.dimension(function (d) {
		return d.color;
    });

    var colorsGroup = colors.group();

/********************************************************
*														*
* 	Step4: Create the Visualisations					*
*														*
********************************************************/

volumeChart.width(400)
            .height(150)
            .dimension(years)
            .group(yearsGroup, "Black and White", "Color")
            .stack(yearsGroup)
			.transitionDuration(1500)
            .centerBar(true)	
			.gap(1)
            .x(d3.scale.linear().domain([1900, 2020]))
			.elasticY(true)
			// .xAxis().tickFormat(function(v) {return v;})
            // .stack(colorGroup)
			;	

/********************************************************
*														*
* 	Step6: 	Render the Charts							*
*														*
********************************************************/
			
	dc.renderAll();
});
