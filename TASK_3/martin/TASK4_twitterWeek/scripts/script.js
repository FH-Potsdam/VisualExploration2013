// JavaScript Document

var Fri_Mon_Arr = [];
	var Fri_Tue_Arr = [];
	var Fri_Wed_Arr = [];
	var Fri_Thu_Arr = [];
	var Fri_Fri_Arr = [];
	var Fri_Sat_Arr = [];
	var Fri_Sun_Arr = [];
	
	var Sat_Mon_Arr = [];
	var Sat_Tue_Arr = [];
	var Sat_Wed_Arr = [];
	var Sat_Thu_Arr = [];
	var Sat_Fri_Arr = [];
	var Sat_Sat_Arr = [];
	var Sat_Sun_Arr = [];

	var Sun_Mon_Arr = [];
	var Sun_Tue_Arr = [];
	var Sun_Wed_Arr = [];
	var Sun_Thu_Arr = [];
	var Sun_Fri_Arr = [];
	var Sun_Sat_Arr = [];
	var Sun_Sun_Arr = [];

	var Mon_Mon_Arr = [];
	var Mon_Tue_Arr = [];
	var Mon_Wed_Arr = [];
	var Mon_Thu_Arr = [];
	var Mon_Fri_Arr = [];
	var Mon_Sat_Arr = [];
	var Mon_Sun_Arr = [];

$(document).ready(function(){

	var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
	var daysOfAquiring = ["Fri", "Sat", "Sun", "Mon"];

	

	var getAllTweets = function getAllTweets(){
		for(var i = 0; i<daysOfAquiring.length; i++){
			for(var j = 0; j<weekdays.length; j++){
				(function getData (i, j) {
					$.getJSON("data/"+daysOfAquiring[i]+"/ENG_"+daysOfAquiring[i]+"-"+weekdays[j]+".json", function(data){
						//$('#main').append('<h4>Twittering on '+daysOfAquiring[i]+'</h4><hr/>');
						$.each(data.statuses, function(key, value){	
							var day = daysOfAquiring[i];
							var query = weekdays[j];
							var text = value.text;
							var timeZone = value.user.time_zone;
							var location = value.user.location;

							var myHTML = "<div class='tweet' data-day='"+day+"' data-query='"+ query +"'>"+text+"</div>";

							if(day=="Fri"){

								if(query=="Mon"){
									Fri_Mon_Arr.push(myHTML);
								}else if(query=="Tue"){
									Fri_Tue_Arr.push(myHTML);
								}else if(query=="Wed"){
									Fri_Wed_Arr.push(myHTML);
								}else if(query=="Thu"){
									Fri_Thu_Arr.push(myHTML);
								}else if(query=="Fri"){
									Fri_Fri_Arr.push(myHTML);
								}else if(query=="Sat"){
									Fri_Sat_Arr.push(myHTML);
								}else if(query=="Sun"){
									Fri_Sun_Arr.push(myHTML);
								}

							}else if(day=="Sat"){

								if(query=="Mon"){
									Sat_Mon_Arr.push(myHTML);
								}else if(query=="Tue"){
									Sat_Tue_Arr.push(myHTML);
								}else if(query=="Wed"){
									Sat_Wed_Arr.push(myHTML);
								}else if(query=="Thu"){
									Sat_Thu_Arr.push(myHTML);
								}else if(query=="Fri"){
									Sat_Fri_Arr.push(myHTML);
								}else if(query=="Sat"){
									Sat_Sat_Arr.push(myHTML);
								}else if(query=="Sun"){
									Sat_Sun_Arr.push(myHTML);
								}

							}else if(day=="Sun"){

								if(query=="Mon"){
									Sun_Mon_Arr.push(myHTML);
								}else if(query=="Tue"){
									Sun_Tue_Arr.push(myHTML);
								}else if(query=="Wed"){
									Sun_Wed_Arr.push(myHTML);
								}else if(query=="Thu"){
									Sun_Thu_Arr.push(myHTML);
								}else if(query=="Fri"){
									Sun_Fri_Arr.push(myHTML);
								}else if(query=="Sat"){
									Sun_Sat_Arr.push(myHTML);
								}else if(query=="Sun"){
									Sun_Sun_Arr.push(myHTML);
								}
								
							}else if(day=="Mon"){

								if(query=="Mon"){
									Mon_Mon_Arr.push(myHTML);
								}else if(query=="Tue"){
									Mon_Tue_Arr.push(myHTML);
								}else if(query=="Wed"){
									Mon_Wed_Arr.push(myHTML);
								}else if(query=="Thu"){
									Mon_Thu_Arr.push(myHTML);
								}else if(query=="Fri"){
									Mon_Fri_Arr.push(myHTML);
								}else if(query=="Sat"){
									Mon_Sat_Arr.push(myHTML);
								}else if(query=="Sun"){
									Mon_Sun_Arr.push(myHTML);
								}
								
							}

							//$('#main').append("<p>Searching on <b>"+day+"</b> about <b>"+query+"</b> | @<b>"+location+"</b> "+text+"</p>");

							//$('#main').append(myHTML);

						});	
					});
				})
				(i,j);
			}

		}
	}
	getAllTweets();
});