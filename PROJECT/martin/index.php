<?php
	include ('filter.php');
	$BAR_WIDTH = 450; // when need to change also change css-class "bar_container"'s width
?>


<!DOCTYPE html>
<html>

<head>
	<title>Show Suggested Priorities</title>
	<meta charset="utf-8">
	<script type="text/javascript" src="scripts/jquery-1.10.2.min.js"></script>
	<script src="scripts/d3.v3.min.js" ></script>
	
	<link rel="stylesheet" href="style.css">

<style>

	.bar_container{
		border: dotted thin #666;
		height: 25px;
		width: 450px;
		margin-bottom: 10px;	
	}
	.bar_interactive{
		height: 100%;
		width: 50px; /*hopefully set by PHP*/
		/*border: dotted thin #666;*/
		color: #fff;
		float: left;
	}
	#bar_gender_m{
		background: #999;
		width: 243px;
	}
	#bar_gender_w{
		background: #666;
		width: 207px;
	}
</style>
</head>

<body>

<div class="bar_container" id="bar_gender">
	<div class="bar_interactive" id="bar_gender_m">male</div>
	<div class="bar_interactive" id="bar_gender_w">female</div>
</div>


<script>

//FILTER FOR SELECTION
var set_min_participants = 1000;
var set_max_participants = 3000;
//var set_noGender = 1;
var set_source = "website";

var g = 99; //start value

$('.bar_interactive').click(function(){
	//event.preventDefault();
	var id = $(this).attr('id');
	
	if(id=='bar_gender_m'){
		g=1;
		console.log("g=1");
	}else if(id=='bar_gender_w'){
		g=2;
		console.log("g=2");
	}
	

	$.ajax({
           type: 'GET',
           url: 'filter.php',
           //data: {'gender': g},
           //data: { gender: 1},
           data: {
           	gender: g
           },
           success: function(data) {
           		var json = JSON.parse(data);

           		console.log(json);

	           var m = json.m;
	           var w = json.w;
	           var sum = json.sum;

	           //DIESEN WERT GIBT ES NICHT IN DEINER FILTER.php
	           //var f = obj.f;

	           console.log("filter.php filters gender vor value: " + f); // no value for f returned. There is the problem?!
	           console.log("g is "+g); // gives an correct result
	           console.log(m + " " + w);
	           $('#bar_gender_m').css('width' , m);
	           $('#bar_gender_w').css('width' , w);
		    //update treemap somehow
	           drawTreemap(g);
           }
      });
});

	var color = d3.scale.ordinal().range(['#edf8e9', '#31a354','#006d2c', '#74c476','#c7e9c0' ]);

	var canvas = d3.select("body").append("svg")
		.attr("width", 1300)
		.attr("height", 65);


var drawTreemap = function(g){



	d3.json("data_echoJsonStructure.php?max_participants="+set_max_participants + 
		"&min_participants="+ set_min_participants + 
		"&noGender=" + g + 
		"&source=" + set_source, function (data){

	var treemap = d3.layout.treemap()
		.size([1300,65])
		.nodes(data);

		//console.log(treemap);

	var cells = canvas.selectAll(".cell")
		.data(treemap)
		.enter()
		.append("g")
		.attr("class", "cell");

	cells.append("rect")
		.attr("x", function (d){ return d.x;} )
		.attr("y", function (d){ return d.y;} )
		.attr("width", function (d){ return d.dx;} )
		.attr("height", function (d){ return d.dy;} )
		.attr("fill", function (d) {return d.children ? null : color(d.parent.name);})
		.attr("stroke", "#fff");

	cells.append("text")
		.attr("x", function (d) {return d.x +  2})
		.attr("y", function (d) {return d.y +  12})
		.text(function (d) {return d.children ? null : d.name.substr(0,12);})
		.attr("fill", "#000")

	})
}

drawTreemap(99);

</script>

<div id="content">loading content...</div>


</body>

</html>
