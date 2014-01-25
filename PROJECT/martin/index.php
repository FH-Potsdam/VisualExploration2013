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


	/*function doSomething() {
	    $.get("somephp.php");
	    return false;
	}*/


//FILTER FOR SELECTION
var set_min_participants = 1000;
var set_max_participants = 3000;
//var set_noGender = 1;
var set_source = "website";

/*			$(document).ready(function() {
			   // setInterval(function(){
			       $.ajax({
			           url: "data_echoSuggestedPriorities.php",
			           type: "GET",
			           dataType: "html",
			           success: function(html) {
			           $("#content").html(html);
			        }
			      });//end ajax call
			  // },2500);//end setInterval

			});//end docReady
*/

var g = 99;

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
	g=1;

	$.ajax({
           type: 'GET',
           url: 'filter.php',
           //data: {'gender': g},
           //data: { gender: 1},
           //data: "gender="+g,
           data: "gender=" + g,
           //data: "gender=1",
           dataType: "html",
           success: function(html) {
           //$("#content").html(html);
           
           var m = "<?php echo $value_gender_m;?>";
           var w = "<?php echo $value_gender_w;?>";
           var f = "<?php echo $filter_gender2;?>";
           console.log("filter.php filters gender vor value: " + f);
           console.log("g is "+g);
           console.log(m + " " + w);
           $('#bar_gender_m').css('width' , m);
           $('#bar_gender_w').css('width' , w);
		   //update treemap somehow
           //drawTreemap(g);
           //console.log("draw new treemap");
           }
      });
	//return false;
});




//d3.slider().axis( d3.svg.axis().orient("top").ticks(6)); 


//$(document).append('<div>'+filter_pref+'</div>');

	var color = d3.scale.ordinal().range(['#edf8e9', '#31a354','#006d2c', '#74c476','#c7e9c0' ]);

	var canvas = d3.select("body").append("svg")
		.attr("width", 1300)
		.attr("height", 65);


var drawTreemap = function(g){


	//request.php?id="+variable

			//"/auswertung.php?name='+ name + '&nickname='+ nickname + '&punkte='+ punkte + '"


	d3.json("data_echoJsonStructure.php?max_participants="+set_max_participants + 
		"&min_participants="+ set_min_participants + 
		"&noGender=" + g + 
		"&source=" + set_source, function (data){
	//d3.json("data_echoJsonStructure.php", function (data){

	//d3.json("data_echoJsonStructure.php?max_participants="+set_max_participants, function (data){


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
		/*.attr("x", function (d) {return d.x +  2})
		.attr("y", function (d) {return d.y +  12})
		.text(function (d) {return d.children ? null : d.name.substr(0,12);})
		.attr("fill", "#000")*/

	})
}

drawTreemap(99);

</script>

<!--<a href="#" onclick="doSomething();">Click Me!</a>-->
<div id="content">loading content...</div>


</body>

</html>
