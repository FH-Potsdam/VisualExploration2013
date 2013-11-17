var people = ["Alice","Bob","Chris","Diana","Ema","Fred","Greg","Henry","Iris","Jane"];
var relations = new Array();
var currentRel = new Array();
var onLayer = new Array();
var onLayerUsed = new Array();
var network = "./js/network.json";

$(document).ready(function(){
	$.getJSON( network, function(data) {
		var cache = data;
	for(var i =0; i<10;i++){
		relations[i]= new Array();
		for(var u = 0; u < 10; u++){
			var tempi = people[i];
			var tempu = people[u];
			relations[i][u] = cache[tempi][tempu];
			onLayer[i]=0;
			onLayerUsed[i]=1;
		}
	}
	})	
	.done(function() {
		$( "li:first" ).trigger( "click" );
		$("li").css("opacity","1");
	});

	$( "li" ).click(function() {
		for(var i = 0; i<10; i++){
			onLayer[i]=0;
		}
		var pers_id = $(this).attr( "pers" );
		$( ".active" ).text( people[pers_id] );
		for(var i = 0; i<10; i++){
			currentRel[i] = relations[pers_id][i];
			onLayer[currentRel[i]]++;
			onLayerUsed[i]=1;
		}
		positioning();
	});
	var positioning = function() {
		for(var i = 0; i<10; i++){
			if(currentRel[i]==0){
				var marginLeft = 0;
			}else if(currentRel[i]==4){
				var marginLeft = 130;
			}else if(currentRel[i]==2){
				var marginLeft = 260;
			}else if(currentRel[i]==1){
				var marginLeft = 390;
			}else if(currentRel[i]==3){
				var marginLeft = 520;
			}else if(currentRel[i]==5){
				var marginLeft = 650;
			}

			$(".person"+i).css("margin-left",marginLeft+"px");
			var marginTop = (800/(onLayer[currentRel[i]]+1))*onLayerUsed[currentRel[i]];
			if(currentRel[i]==0){
				marginTop = 33;
			}
			console.log(onLayer[currentRel[i]]);
			onLayerUsed[currentRel[i]]++;
			$(".person"+i).css("margin-top",marginTop+"px");
		}
	};

	$( "li" )
  		.mouseenter(function() {
  			$(this).find("p").css("display", "inline");
  			$(this).find("img").css("opacity", "0.3");
  		})
  		.mouseleave(function() {
  			$(this).find("p").css("display", "none");
  			$(this).find("img").css("opacity", "1");
  		})
});