var page = 1;
var colors;
var color;
var colorThief = new ColorThief();
var onconizer = 0;

$(document).ready(function(){
		getImg();
});

function getImg(){
	console.log(page);
	$.getJSON("./js/results.json").done(function(imageDB) {
		var flickrAPI = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=59705bb8b21e0601e5a03bf1aea83105&tags=art&tag_mode=art&per_page=200&page="+page+"&format=json&nojsoncallback=1";
		$.getJSON(flickrAPI).done(function(dataJ) {
			onconizer = 0;
			for(var i = 0; i<= dataJ.photos.photo.length; i++){
					console.log(i);
					$.ajax({
					  type: 'POST',
					  url: "./js/saveImg.php",
					  data: {
			              link: "http://farm"+dataJ.photos.photo[i].farm+".staticflickr.com/"+dataJ.photos.photo[i].server+"/"+dataJ.photos.photo[i].id+"_"+dataJ.photos.photo[i].secret+"_m.jpg",
			              id: "../img/bild_"+i+".jpg"
			            },
					  success: function(){
					            	$(".grid").append("<img class='img_"+i+"' number='"+i+"' src='./img/bild_"+i+".jpg'></img>");
			          				var activeImg = $(".img_"+i);
			          				$(".img_"+i).load(function(){
			          					var id = $(this).attr("number");
						    			color = colorThief.getColor(this);
	          							var r = Math.floor(color[0]/10);
					              		var g = Math.floor(color[1]/10);
					              		var b = Math.floor(color[2]/10);

				              			if(imageDB.red[r].green[g].blue[b].id == 0){
				              				imageDB.red[r].green[g].blue[b].farm = dataJ.photos.photo[id].farm;
				              				imageDB.red[r].green[g].blue[b].server = dataJ.photos.photo[id].server;
				              				imageDB.red[r].green[g].blue[b].id = dataJ.photos.photo[id].id;
				              				imageDB.red[r].green[g].blue[b].secret = dataJ.photos.photo[id].secret;
				              				console.log(id+"_"+r+"_"+g+"_"+b+"_"+imageDB.red[r].green[g].blue[b].id);
				              			};
			              				
			              				var tempost = JSON.stringify(imageDB);
			              				console.log(id);
			              				var m = (dataJ.photos.photo.length)-1;
			              				if(id==m){
			              						$.ajax({
					              					type: 'POST',
					              					url: "./js/saveJSON.php",
					              					data: {json: tempost, a:"1"},
					              					success: function() {
					              						console.log("written");
												    	once();
												 	},
												 	async:false
					              				});
										  }
	          						});
			          			},
					  async:false
					});

						//page=page+1;
						//getImg();

						function once(){
							if(onconizer==0){
								onconizer = 1;
								console.log("ONLY ONCE!");
								$("img").remove();
								page=page+1;
								getImg();
							}
						}
						  /*
						$.ajax({
				            type: "POST",
				            dataType: "json",
				            url: "./js/saveJSON.php",
				            data: imageDB,
				            async:false,
				            success: function(){
				                alert('Items added');
				                count = count+i;
				            },
				            error: function(){
				                console.log("FAIL");
				            }
				   		});*/
			}
		});
	});
};