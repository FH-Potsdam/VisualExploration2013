<?php
	//include ('filter.php');
	$BAR_WIDTH = 450; // when need to change also change css-class "bar_container"'s width
	//MY VOTE: 100,102,103,105,107,108
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


</style>
</head>

<body>
<div class="bar_container" style="height:45px; width: 420px">
	<div class="priority_btn priority_100" id="priority_btn_100">Action taken on climate change</div>
	<div class="priority_btn priority_101" id="priority_btn_101">Better transport and roads</div>
	<div class="priority_btn priority_102" id="priority_btn_102">Support for people who can't work</div>
	<div class="priority_btn priority_103" id="priority_btn_103">Access to clean water and sanitation</div>
	<div class="priority_btn priority_104" id="priority_btn_104">Better healthcare</div>
	<div class="priority_btn priority_105" id="priority_btn_105">A good education</div>
	<div class="priority_btn priority_106" id="priority_btn_106">A responsive government we can trust</div>
	<div class="priority_btn priority_107" id="priority_btn_107">Phone and internet access</div>
	<div class="priority_btn priority_108" id="priority_btn_108">Reliable energy at home</div>
	<div class="priority_btn priority_109" id="priority_btn_109">Affordable and nutritious food</div>
	<div class="priority_btn priority_110" id="priority_btn_110">Protecting forests, rivers and oceans</div>
	<div class="priority_btn priority_111" id="priority_btn_111">Political freedoms</div>
	<div class="priority_btn priority_112" id="priority_btn_112">Protection against crime and violence</div>
	<div class="priority_btn priority_113" id="priority_btn_113">Freedom from discrimination and persecution</div>
	<div class="priority_btn priority_114" id="priority_btn_114">Equality between men and women</div>
	<div class="priority_btn priority_115" id="priority_btn_115">Better job opportunities</div>
	<div id="priority_text" style="border-top: solid 6px #fff; float:left; color: #666; width: 416px; padding: 0px; height:12px; background-color: #fff"></div>
</div>
<div class="bar_container" id="bar_gender">
	<div class="bar_undo"></div>
	<div class="bar_interactive" id="bar_gender_m">male</div>
	<div class="bar_interactive" id="bar_gender_w">female</div>
</div>
<div class="bar_container" id="bar_source">
	<div class="bar_undo"></div>
	<div class="bar_interactive" id="bar_source_sms">sms</div>
	<div class="bar_interactive" id="bar_source_website">web</div>
	<div class="bar_interactive" id="bar_source_offline">offline</div>
	<div class="bar_interactive" id="bar_source_apps">apps</div>
</div>

<div id="treemap"></div>

<div id="bar_container_participants">
	<div id="bar_participants"></div>
</div>

<div class="example_div"></div>

<script>


//FILTER FOR SELECTION
var set_min_participants = 1;
var set_max_participants = 300000;
//var set_noGender = 1;
var set_source = "";



var gen = 99;
var sou = "sms";

$('.bar_interactive').hover(function(){
	$(this).css("opacity", "0.9");
},function(){
	$(this).css("opacity", "1");
});


$('.bar_interactive').click(function(){
	//event.preventDefault();
	var id = $(this).attr('id');
	var clicked = id;
	
	if(id=='bar_gender_m'){
		gen=2; //the opposite > !=
	}else if(id=='bar_gender_w'){
		gen=1;
	}else{g="undefined";};
	
	console.log("g="+gen);

	$('svg').empty(); //delete treemap
	drawTreemap(gen);
    console.log("refreshed treemp");

	$.ajax({
           type: 'GET',
           url: 'filter.php',
           data: {
           	gender : gen,
           	source : sou,
           	clicked : clicked
           },

           success: function(data) {
           	var json = JSON.parse(data);

           	var count_sms = json.source[3].sms;
           
           	console.log("sms: " + count_sms);
           	/*
           	var m = json.m;
           	var w = json.w;
           	var s = json.sum; // =how many votes in selection
           	var statements = json.statements;
           	*/
           	
//drawStatements(statements);
			
			/*
            console.log("m=" + m + ", w= " + w + " s ="+s);
            $('#bar_gender_m').animate({width: m+"px",}, 500); //.css('width' , m);
            $('#bar_gender_w').animate({width: w+"px",}, 500); //.css('width' , w);
            $('#bar_participants').animate({width: s+"px",}, 500);
            */
           
		 }
      });
	//return false;
});

	//var color = d3.scale.ordinal().range(['#edf8e9', '#31a354','#006d2c', '#74c476','#c7e9c0' ]);
	var color = d3.scale.ordinal().range(['#444', '#666','#888', '#aaa','#ccc' ]);

	var canvas = d3.select("#treemap").append("svg")
		.attr("width", 1300)
		.attr("height", 50);


var drawTreemap = function(g){

var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("Country - value");


	
		d3.json("data_echoJsonStructure.php?max_participants="+set_max_participants + 
			"&min_participants="+ set_min_participants + 
			"&gender=" + g + 
			"&source=" + set_source, function (data){
	


	//d3.json("data_echoJsonStructure.php", function (data){

	//d3.json("data_echoJsonStructure.php?max_participants="+set_max_participants, function (data){


	var treemap = d3.layout.treemap()
		.size([1300,50]) //1300, 65
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
		.attr("stroke", "#fff")
			.on("mouseover", function(){return tooltip.style("visibility", "visible");})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
			
	//tooltip.text(function (d) {return d.children ? null : d.name.substr(0,12);}); //!


	cells.append("text")
		.attr("x", function (d) {return d.x +  2})
		.attr("y", function (d) {return d.y +  12})
		.text(function (d) {return d.children ? null : d.name.substr(0,0);})
		.attr("fill", "#fff")
	})
}



var drawStatements = function (s){
	
	$('#content').html(s);
}



drawTreemap(99);

$('rect').click(function(){
	alert("rect clicked");
});

var hover_priority_btn1 = function(){

	$('.priority_btn').hover(function(){
		var myId = $(this).attr("id"); // #priority_btn_104
		
		var prio_nr = myId.substr(13,15); //get "100" from "priority_btn_100"
			//$('.statement_container:has(.priority_'+ prio_nr +')').css("background-color", "#eee");
			$('.statement_container:not(:has(.priority_'+ prio_nr +'))').hide();
		},function(){
			$('.statement_container').show();//css("background-color", "#fff");//show();
		});
		
	$('.priority_btn').click(function(){
		alert("klick comes later");
	});

}


hover_priority_btn1();

// SHOW TEXT-DIV FOR PRIORITIES WHEN HOVER
$('.priority_btn').hover(function(){
	var this_color = $(this).css("background-color");
	//$('#priority_text').css("background-color", this_color);
	$('#priority_text').css("border-top-color", this_color);
	var this_text = $(this).text();
	$('#priority_text').html(this_text);
	//$('.priority_btn').not(this).css("opacity", "0.7");
	$(this).css("opacity", "1");
	//console.log("hover over priority_btn");
},function(){
	$('#priority_text').css({"background-color":"#fff", "border-top-color":"#fff"});
	$('#priority_text').html("");
	$('.priority_btn').css("opacity", "0.4");
});


</script>

<div id="content">
	<div class='statement_container'><div class='statement_text'>»Ending Violence Against Women«</div><div class='statement_text_meta'>42 years old women from Australia</div><div class='priority_thumb priority_102'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_109'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_114'></div><div class='priority_thumb priority_115'></div></div>
	<div class='statement_container'><div class='statement_text'>»Close down off-shore detention«</div><div class='statement_text_meta'>71 years old women from Australia</div><div class='priority_thumb priority_100'></div><div class='priority_thumb priority_103'></div><div class='priority_thumb priority_109'></div><div class='priority_thumb priority_110'></div><div class='priority_thumb priority_112'></div><div class='priority_thumb priority_114'></div></div><div class='statement_container'><div class='statement_text'>»Less emphasis on profit, more on environment«</div><div class='statement_text_meta'>30 years old women from Australia</div><div class='priority_thumb priority_103'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_109'></div><div class='priority_thumb priority_110'></div></div><div class='statement_container'><div class='statement_text'>»More rights for women in opressed country«</div><div class='statement_text_meta'>21 years old women from Australia</div><div class='priority_thumb priority_103'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_112'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_114'></div></div><div class='statement_container'><div class='statement_text'>»elimination of corruption«</div><div class='statement_text_meta'>20 years old man from Belarus</div><div class='priority_thumb priority_101'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_110'></div><div class='priority_thumb priority_111'></div><div class='priority_thumb priority_115'></div></div><div class='statement_container'><div class='statement_text'>»ensure that extractive industries meet strong environmental and human rights standards«</div><div class='statement_text_meta'>45 years old women from Brazil</div><div class='priority_thumb priority_100'></div><div class='priority_thumb priority_103'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_110'></div><div class='priority_thumb priority_112'></div><div class='priority_thumb priority_114'></div></div><div class='statement_container'><div class='statement_text'>»Freedom of speach«</div><div class='statement_text_meta'>17 years old women from Cameroon</div><div class='priority_thumb priority_102'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_111'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_115'></div></div><div class='statement_container'><div class='statement_text'>»Protection from Forced Abortion«</div><div class='statement_text_meta'>59 years old women from Canada</div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_107'></div><div class='priority_thumb priority_109'></div><div class='priority_thumb priority_111'></div><div class='priority_thumb priority_114'></div></div><div class='statement_container'><div class='statement_text'>»Equality for All«</div><div class='statement_text_meta'>53 years old women from Canada</div><div class='priority_thumb priority_100'></div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_112'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_114'></div></div><div class='statement_container'><div class='statement_text'>»Comprehensive sex education for youth«</div><div class='statement_text_meta'>24 years old man from Indonesia</div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_111'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_114'></div><div class='priority_thumb priority_115'></div></div>
	<div class='statement_container'><div class='statement_text'>»Youth participation guaranteed by the government«</div><div class='statement_text_meta'>32 years old women from Indonesia</div><div class='priority_thumb priority_101'></div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_110'></div><div class='priority_thumb priority_112'></div><div class='priority_thumb priority_113'></div></div>
	<div class='statement_container'><div class='statement_text'>»Sexual work recognized as a profession«</div><div class='statement_text_meta'>34 years old man from Indonesia</div><div class='priority_thumb priority_104'></div><div class='priority_thumb priority_105'></div><div class='priority_thumb priority_106'></div><div class='priority_thumb priority_111'></div><div class='priority_thumb priority_113'></div><div class='priority_thumb priority_115'></div></div>

	<div class="statement_container">

    <div class="statement_text">

        »Sustainable access to water for livelihoods, in p…

    </div>
    <div class="statement_text_meta">

        30 years old man from United Kingdom of Great Brit…

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_108"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_110"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »More integration among people!«

    </div>
    <div class="statement_text_meta">

        25 years old man from Croatia

    </div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_110"></div>
    <div class="priority_thumb priority_111"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Less powerful, motre transparent multinational co…

    </div>
    <div class="statement_text_meta">

        43 years old man from Belgium

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_111"></div>
    <div class="priority_thumb priority_113"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Civil liberties«

    </div>
    <div class="statement_text_meta">

        30 years old man from United Kingdom of Great Brit…

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_107"></div>
    <div class="priority_thumb priority_114"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »A responsible, accountable and democratic global …

    </div>
    <div class="statement_text_meta">

        38 years old man from Pakistan

    </div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_113"></div>
    <div class="priority_thumb priority_114"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Heath, political freedom, law and order, and Most…

    </div>
    <div class="statement_text_meta">

        24 years old man from Pakistan

    </div>
    <div class="priority_thumb priority_102"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_112"></div>
    <div class="priority_thumb priority_114"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Global opportunities to make world youth populati…

    </div>
    <div class="statement_text_meta">

        25 years old man from India

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_110"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Social protection«

    </div>
    <div class="statement_text_meta">

        45 years old man from Indonesia

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_101"></div>
    <div class="priority_thumb priority_102"></div>
    <div class="priority_thumb priority_113"></div>
    <div class="priority_thumb priority_114"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Sustainable intensification of tropical agricultu…

    </div>
    <div class="statement_text_meta">

        66 years old man from United Kingdom of Great Brit…

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_110"></div>
    <div class="priority_thumb priority_111"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Education of girls«

    </div>
    <div class="statement_text_meta">

        85 years old man from United Kingdom of Great Brit…

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_112"></div>
    <div class="priority_thumb priority_114"></div>
    <div class="priority_thumb priority_115"></div>

</div>

<div class="statement_container" style="display: block;">

    <div class="statement_text">

        »An honest and responsive government is key to ach…

    </div>
    <div class="statement_text_meta">

        40 years old women from Bhutan

    </div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_108"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_110"></div>
    <div class="priority_thumb priority_114"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Sustainable urbanization and urban challenges«

    </div>
    <div class="statement_text_meta">

        31 years old women from Spain

    </div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_113"></div>
    <div class="priority_thumb priority_114"></div>

</div>
<div class="statement_container" style="display: block;">

    <div class="statement_text">

        »better protection for children«

    </div>
    <div class="statement_text_meta">

        58 years old women from Jamaica

    </div>
    <div class="priority_thumb priority_100"></div>
    <div class="priority_thumb priority_101"></div>
    <div class="priority_thumb priority_102"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_111"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container" style="display: block;">

    <div class="statement_text">

        »Sustainable growth«

    </div>
    <div class="statement_text_meta">

        37 years old women from United Kingdom of Great Br…

    </div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_106"></div>
    <div class="priority_thumb priority_111"></div>
    <div class="priority_thumb priority_114"></div>
    <div class="priority_thumb priority_115"></div>

</div>
<div class="statement_container">

    <div class="statement_text">

        »Elimination of poverty and sociao-econcomic gaps«

    </div>
    <div class="statement_text_meta">

        55 years old women from Israel

    </div>
    <div class="priority_thumb priority_102"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_107"></div>
    <div class="priority_thumb priority_109"></div>
    <div class="priority_thumb priority_113"></div>

</div>
<div class="statement_container" style="display: block;">

    <div class="statement_text">

        »Human rights -including social and economic right…

    </div>
    <div class="statement_text_meta">

        35 years old women from Denmark

    </div>
    <div class="priority_thumb priority_103"></div>
    <div class="priority_thumb priority_104"></div>
    <div class="priority_thumb priority_105"></div>
    <div class="priority_thumb priority_108"></div>
    <div class="priority_thumb priority_112"></div>
    <div class="priority_thumb priority_114"></div>

</div>

</div>
</body>

</html>
