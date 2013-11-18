// JavaScript Document

$(document).ready(function(){

	var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var CENTER_X = canvas.width / 2;
    var CENTER_Y = canvas.height / 2;
    var MULT_X = canvas.width/360;
    var MULT_Y = canvas.height/180;
    var pictures = [];
    var index = 0;
    var view_Arr = [];
    var views_Max = 9097;//0;
    var views_Min = 1355;//999999;

/*** BEGIN PICTURE CLASS ***/
	function Picture(lat, lon, col_r, col_g, col_b, v_, ctx, url){

		this.latitude = CENTER_X + (lat*MULT_X );
		this.longitude = CENTER_Y - (lon*MULT_Y);
		this.ctx = ctx;
		this.views = v_;
		this.url = url;
		this.url_Arr = this.url.split("/");
		this.myName = this.url_Arr[this.url_Arr.length-1];
		this.myUrl = "images/flickr/"+this.myName;
		console.log("myUrl: "+this.myUrl);


		this.drawCircle = function drawCircle(){
			context.beginPath();
	      	context.arc(this.latitude, this.longitude, 1, 0, 2 * Math.PI, false);
		    context.fillStyle = 'rgba('+col_r+', '+col_g+', '+col_b+', 1)';
		    context.fill();
		    context.lineWidth = 1;
		    context.strokeStyle = 'rgba(0,0,0,0)';
		    context.stroke();
		}

		this.drawPicture = function drawPicture(){
			//change Background-image of div
			//$('#myPhoto').css("background",myUrl);
			
		}
	
		this.drawText = function drawText(views){
			//var mySize = Math.round((views_Min * this.views / views_Max)/30);
			var mySize = Math.round(map(this.views, views_Min, views_Max, 10,30));
			console.log("the max is "+views_Max);
			var titleHTML = "<span class='mySpan' id='"+this.myUrl+"' style='font-size: "+ mySize +"px'>"+this.ctx+"</span";
			$('#myTitles').append(titleHTML, ' | ');
		};
	}
/*** END PICTURE CLASS ***/
	


	$.getJSON('scripts/flickr_final.json', function(data){

		$.each(data.photos, function(key, value){	
			var x = value.latitude;
			var y = value.longitude;
			var r = value.color_avg[0];
			var g = value.color_avg[1];
			var b = value.color_avg[2];
			var v = value.views;
			var con = value.title;
			var url = value.url_q;
			if(con == ""){
				con = "no title";
			}
			pictures[index] = new Picture(y,x,r,g,b,v,con,url); //WHY THAT???
						
			/*if(x!=0 && y!=0){
				pictures[index].drawCircle();
				index ++;
			}*/
			//pictures[index].drawCircle();
			pictures[index].drawText();
			pictures[index].drawPicture(value.url_q);

			view_Arr.push(v);
		});	
		
		getBounds();

		$('.mySpan').mouseenter(function(){
			var newImageSource = this.id;
			$('#myPhoto').css({
				"background": "url("+newImageSource+")", 
				"background-repeat":"no-repeat"
			});
		});

	});



	var getBounds = function getBounds(){
		for(var i=0; i<200;i++)	{	
			if(view_Arr[i] > views_Max){
				views_Max = view_Arr[i];
			}
			else if(view_Arr[i] < views_Min){
				views_Min = view_Arr[i];
			}
		}

	}

	function map(x, in_min, in_max, out_min, out_max) {
 		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}



	
	

});