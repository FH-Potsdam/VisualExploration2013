var pixelArray = new Array();
var images;
var source;
var sID =1;
var weite;
var hoehe;
var elemNow;
create();
$(document).ready(function(){
  alert("Welcome to PIXELJOURNEY!\n\nTo head into a new direction, simply click on an image you like.\n\nIf you want to open an image in a new Tab, please hover it and press 'w'.\n\nEnjoy the endless depths of JSONIA!");
})
function create(){
    weite = Math.round(($(window).width())/25);
    $('.wrapper').css("height",weite*25+"px");
    $('.imgLoader').css("width",weite+"px");
    $('.imgLoader').css("height",weite+"px");
    $('.grid').css("width",weite*25+"px");
    $('.imgLoader').load(function() {
        this.canvas = $('<canvas/>').css({width:this.width + 'px', height: this.height + 'px'})[0];
        this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        for(var i = 0; i < weite; i++){
          for(var u = 0; u < weite; u++){
            pixelArray[(i*weite)+u] = this.canvas.getContext('2d').getImageData(u, i , 1, 1).data;
          } 
          }
        $.getJSON("./js/results.json").done(function( data ) {
        for (var i = 0; i < weite*weite; i++){
        $(".grid").append("<div class='img_"+i+"'></div>");
        var cssStyle = "rgb("+pixelArray[i][0]+","+pixelArray[i][1]+","+pixelArray[i][2]+")";
        $(".grid .img_"+i).css("background", cssStyle);
        var r = Math.floor(pixelArray[i][0]/10);
        var g = Math.floor(pixelArray[i][1]/10);
        var b = Math.floor(pixelArray[i][2]/10);
        if(data.red[r].green[g].blue[b].id != 0){
          $(".grid .img_"+i).append("<img src='http://farm"+data.red[r].green[g].blue[b].farm+".staticflickr.com/"+data.red[r].green[g].blue[b].server+"/"+data.red[r].green[g].blue[b].id+"_"+data.red[r].green[g].blue[b].secret+"_q.jpg')>");
        }
        $("aside").css("opacity",1);
        }
        $( "img" ).click(function() {
            $("aside").css("opacity",0);
            source = $(this).attr("src");
            $("body").css("background","url('"+source+"')");
            $("body").css("background-size","100%");
            createWrap(source);
          });
        $(document).keypress(function(e){
          var elem = $("aside img").attr("src");
          switch(e.which){
            case 119:  openBig(elem);
            break;
          }
        });
        $("img").mouseover(function(){
            var curimg = $(this).attr("src");
            $("aside img").attr("src", curimg);
            $("aside img").css("opacity", 1);
        });
        $(".grid div").mouseover(function(){
        var position = $(this).position();
            $("aside img").css("top", position.top+25+"px");
            $("aside img").css("left", position.left+25+"px");
          });
        $("img").mouseout(function(){
            $("aside img").css("opacity", 0);
        });
        });
    });
};
$('.wrapper').css("height",weite+"px");
function createWrap(curr){
  $.ajax({
            type: 'POST',
            url: "./js/saveImg.php",
            data: {
                    link: source,
                    id: "../img/test"+sID+".jpg"
                  },
            success: function(){
              $(".grid div").remove();
              $(".imgLoader").attr("src","./img/test"+sID+".jpg");
              sID = sID + 1;
              console.log("SUZZZES");
            },
            async:false
          });
  //create(curr);
}

function openBig(x){
  x = x.slice(0,-5);
  window.open(x+"b.jpg", "_blank");
  console.log(x+"b.jpg");
}