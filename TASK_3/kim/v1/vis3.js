
/********************************************************
*														*
* 	Step0: Load data from json file						*
*														*
********************************************************/
d3.csv("data/color.csv", function (data) {
	
/********************************************************
*														*
* 	Step1: Create the dc.js chart objects & ling to div	*
*														*
********************************************************/
var redBars = dc.barChart("#redBars");

var greenBars = dc.barChart("#greenBars");

var blueBars = dc.barChart("#blueBars");

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

    var red = ndx.dimension(function (d) {
		return d.red;
    });

    var redGroup = red.group();

    var green = ndx.dimension(function (d) {
        return d.green;
    });

    var greenGroup = green.group();

    var blue = ndx.dimension(function (d) {
        return d.blue;
    });

    var blueGroup = blue.group();


/********************************************************
*														*
* 	Step4: Create the Visualisations					*
*														*
********************************************************/

redBars
            .width(900)
            .height(150)
            .dimension(red)
            .group(redGroup)
			.transitionDuration(1500)
            .centerBar(true)	
			.gap(1)
            .x(d3.scale.linear().domain([0, 255]))
			.elasticY(false)
			// .xAxis().tickFormat(function(v) {return v;})
            // .stack(colorGroup)
			;	

greenBars
            .width(900)
            .height(150)
            .dimension(green)
            .group(greenGroup)
            .transitionDuration(1500)
            .centerBar(true)    
            .gap(1)
            .x(d3.scale.linear().domain([0, 255]))
            .elasticY(false)
            // .xAxis().tickFormat(function(v) {return v;})
            // .stack(colorGroup)
            ;   

blueBars
            .width(900)
            .height(150)
            .dimension(blue)
            .group(blueGroup)
            .transitionDuration(1500)
            .centerBar(true)    
            .gap(1)
            .x(d3.scale.linear().domain([0, 255]))
            .elasticY(false)
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
