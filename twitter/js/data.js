$console = $('div#console');

var fav = 0,
    ret = 0,
    hash = 0,
    user = 0;

var tweets = new Array();

function addData_Initialize(data) {
	data.forEach(drawElement);
	//console.log(fav, ret, hash, user);
    console.log(tweets);
    console.log(tweets.length);
    drawData(tweets);
}

function drawElement(element, index, array) {
    //console.log("a[" + index + "] = " + element);
    //data[index] = new Array(4);
    
    tweets[index] = {
        'text': element.text,
        'leng': element.text.length,
        'fav': element.favorite_count,
        'ret': element.retweet_count,
        'hash': element.entities.hashtags.length,
        'user': element.entities.user_mentions.length,
        'urls': element.entities.urls.length,
        
    };

    // data[index][0] = element.favorite_count;
    // data[index][1] = element.retweet_count;
    // data[index][2] = element.entities.hashtags.length;
    // data[index][3] = element.entities.user_mentions.length;

    if(element.favorite_count == 0) { fav++; }
    if(element.retweet_count == 0) { ret++; }

    if(element.entities.hashtags.length == 0) { hash++; }
    if(element.entities.user_mentions.length == 0) { user++; }
}

// function drawData (data) {
//     var pc = d3.parcoords()("#canvas")
//       .data(data)
//       .render()
//       .ticks(3)
//       .createAxes();
// }



// linear color scale
var blue_to_brown = d3.scale.linear()
  .domain([0, 40])
  .range(["steelblue", "brown"])
  .interpolate(d3.interpolateLab);

var dimensions = ["leng", "fav", "ret", "hash", "hash", "user", "urls"];

// interact with this variable from a javascript console
var pc1;

// load csv file and create the chart
function drawData(data) {
  pc1 = d3.parcoords()("#canvas")
    .data(data)
    .color(function(d) { return blue_to_brown(d['fav']); })  // quantitative color scale
    .alpha(0.4)
    .render()
    .brushable()  // enable brushing
    .interactive()  // command line mode

  var explore_count = 0;
  var exploring = {};
  var explore_start = false;
  pc1.svg
    .selectAll(".dimension")
    .style("cursor", "pointer")
    .on("click", function(d) {
      exploring[d] = d in exploring ? false : true;
      event.preventDefault();
      if (exploring[d]) d3.timer(explore(d,explore_count));
    });

  function explore(dimension,count) {
    if (!explore_start) {
      explore_start = true;
      d3.timer(pc1.brush);
    }
    var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
    return function(t) {
      if (!exploring[dimension]) return true;
      var domain = pc1.yscale[dimension].domain();
      var width = (domain[1] - domain[0])/4;

      var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

      pc1.yscale[dimension].brush.extent([
        d3.max([center-width*0.01, domain[0]-width/400]),  
        d3.min([center+width*1.01, domain[1]+width/100])  
      ])(pc1.g()
          .filter(function(d) {
            return d == dimension;
          })
      );
    };
  };

  var grid = d3.divgrid();
    d3.select("#grid")
      .datum(data.slice(0,600))
      .call(grid)
      .selectAll(".row")
      .on({
        "mouseover": function(d) { pc1.highlight([d]) },
        "mouseout": pc1.unhighlight
      });

    // update data table on brush event
    pc1.on("brush", function(d) {
      d3.select("#grid")
        .datum(d.slice(0,600))
        .call(grid)
        .selectAll(".row")
        .on({
          "mouseover": function(d) { pc1.highlight([d]) },
          "mouseout": pc1.unhighlight
        });
    });

}