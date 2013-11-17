jQuery(document).ready(function($) {
	$.getJSON( "../data/flickr_final.json", function( data ) {
    var count = 0;
		$.each( data.photos, function( key, val ) {
      functions.clean_tag(val);
	  });
    functions.data = data.photos;
    
		_.each( data.photos, function( item, index ) { functions.connections.push({"name":item.id+"-date","id":item.id,"color":item.color_avg,"url":item.url_q,"type":"date","size":1,"imports":functions.search_date(item.dateupload, count)});
      functions.connections.push({"name":item.id+"-tag","id":item.id,"color":item.color_avg,"url":item.url_q,"type":"tag","size":1,"imports":functions.search_tag(item.tags, count)});
      functions.connections.push({"name":item.id+"-color","id":item.id,"color":item.color_avg,"url":item.url_q,"type":"color","size":1,"imports":functions.search_color(item.color_avg, count)});
	  });
    functions.draw();

  });
  
});


var count = 0;
functions = {
  data: null,
  connections: [],
  
  clean_tag: function(val) {
    val.tags = val.tags.replace(new RegExp("vision:(.*)$", "g"), "");
    val.tags = _.without(val.tags.split(" "), "");    
    return val;
  },
  search_date : function(date, count) {
    items = _.filter(this.data, function(item) {return date <= parseInt(item.dateupload)+parseInt(30) && date >= parseInt(item.dateupload)-parseInt(30) });
    return _.map(items, function(item) { return item.id+"-date" });
  },
  
  search_tag: function(tags, count) {
    self = this;
    items = _.filter(this.data, function(item) { return _.some(item.tags, function(tag) { if(_.contains(tags, tag) == true) { return tag;} }) });
    return _.map(items, function(item) { return item.id+"-tag" });
  },
  search_color: function(color_avg, count) {
    self = this;
    items = _.filter(this.data, function(item) { return self.com_color(color_avg, item) });
    return _.map(items, function(item) { return item.id+"-color" });
  },
  

  com_color : function(color_avg, item) {
   
    var color_diff = [];
    var diff = 0;
    for(i = 0; i < 3; i++) {
      if(item.color_avg[i] < color_avg[i]) {
        color_diff[i] = parseInt(color_avg[i])-parseInt(item.color_avg[i]);
      } else {
        color_diff[i] = parseInt(item.color_avg[i])-parseInt(color_avg[i]);
      }
    }
    var index_org = _.indexOf(color_avg, _.max(color_avg));
    var index_com = _.indexOf(item.color_avg, _.max(item.color_avg));
    
    if(index_org == index_com) {
      color_diff[index_com] = parseInt(color_diff[index_com ])-parseInt(50);
    }
    
    diff = color_diff[0]+color_diff[1]+color_diff[2];
    
    if(0 < diff && diff < 9) {return true; }
  },

  draw: function() {   
  	var diameter = 760,
  	    radius = diameter / 2,
  	    innerRadius = radius - 20;

  	var cluster = d3.layout.cluster()
  	    .size([360, innerRadius])
  	    .sort(null)
  	    .value(function(d) { return d.size;});

  	var bundle = d3.layout.bundle();

  	var line = d3.svg.line.radial()
  	    .interpolate("bundle")
  	    .tension(.85)
  	    .radius(function(d) { return d.y; })
  	    .angle(function(d) { return d.x / 180 * Math.PI; });

  	var svg = d3.select("body").append("svg")
  	    .attr("width", diameter)
  	    .attr("height", diameter)
  	  .append("g")
  	    .attr("transform", "translate(" + radius + "," + radius + ")");
    
    var preview_section = d3.select("body").append("div")
        .classed("preview", true);
    
    var preview_image = preview_section.append("div")
        .classed("preview_image section", true);
    var preview_color = preview_section.append("div")
        .classed("preview_color section", true);
    var preview_tag = preview_section.append("div")
        .classed("preview_tag section", true);
    var preview_date = preview_section.append("div")
        .classed("preview_date section", true);

        
    var packages = {
      // Lazily construct the package hierarchy from class names.
      root: function(classes) {
        var map = {};

        function find(name, data) {
          var node = map[name], i;
          if (!node) {
            node = map[name] = data || {name: name, children: []};
            if (name.length) {
              node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
              node.parent.children.push(node);
              node.key = name.substring(i + 1);
            }
          }
          return node;
        }

        classes.forEach(function(d) {
          find(d.name, d);
        });

        return map[""];
      },

      // Return a list of imports for the given array of nodes.
      imports: function(nodes) {
        var map = {},
            imports = [];

        // Compute a map from name to node.
        nodes.forEach(function(d) {
          map[d.name] = d;
        });

        // For each import, construct a link from the source to target node.
        nodes.forEach(function(d) {
          if (d.imports) d.imports.forEach(function(i) {
            imports.push({source: map[d.name], target: map[i]});
          });
        });

        return imports;
      }
    };
    
    var events = {
      over: function(d) {
        var selected_items = svg.selectAll(".id-"+d.id);
        var all_items = svg.selectAll(".link");
        
        all_items.classed("inactive", true); 
        svg.selectAll(".id-"+d.id).classed("active", true);

        events.draw_preview(d.id);
         
      },
      out: function(d) {
        svg.selectAll(".link").classed("inactive", false); 
        svg.selectAll(".link").classed("active", false); 
      },
      draw_preview: function(id) {
        d3.select(".preview_image").selectAll(".image").remove();
        d3.select(".preview_image").append("img")
            .attr("class","image")
            .attr("src", function() { test = _.find(functions.connections, function(item) { return item.id == id });   if(test) return test.url })
            .style("border", function() { 
              item = _.find(functions.connections, function(item) { return item.id == id });
              if(item) {
                return "rgb("+item.color[0]+","+item.color[1]+","+item.color[2]+") 5px solid" 
              }
            });
            
        types = _.without(_.filter(functions.connections, function(item) { return item.id == id }), undefined);
        _.each(types, function(type, index){
          var count = 0;
            d3.select(".preview_"+type.type).selectAll(".content").remove();
            d3.select(".preview_"+type.type).selectAll(".title").remove();
            d3.select(".preview_"+type.type).append("div")
              .classed("title "+type.type, true)
              .text(type.type);
            d3.select(".preview_"+type.type).append("div")
                .classed("content", true)
              .selectAll(".image")
                .data(_.without(type.imports, id+"-"+type.type))
              .enter().append("img")
                .attr("class","image")
                .style("border", function(d) { 
                  item = _.find(functions.connections, function(item) { return item.name == d });
                  // console.log(item);
                  return "rgb("+item.color[0]+","+item.color[1]+","+item.color[2]+") 5px solid"
                })
                .attr("src", function(d) { test = _.find(functions.connections, function(item) { return item.name == d });   if(test) return test.url });
        });
      }
    }   
    
    var nodes = cluster.nodes(packages.root(this.connections)),
        links = packages.imports(nodes);
        splines = bundle(links);

    svg.selectAll(".link")
        .data(bundle(links))
      .enter().append("path")
        .attr("class", function(d) { return "link link-"+d[0].type+" id-"+d[0].id})
        .attr("d", function(d, i) { return line(splines[i]) });

    svg.selectAll(".node")
        .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .append("image")
        .attr("x", 2)
        .attr("y", 0)
        .attr("class", function(d) { return "id-"+d.id })
        .attr("width", function(d) { return d.type == "date" ? "10" : "0"})
        .attr("height", function(d) { return d.type == "date" ? "10" : "0"})
        .attr("xlink:href", function(d) { return d.url;})
        .on("mouseover", events.over)
        .on("mouseout", events.out);


  	d3.select(self.frameElement).style("height", diameter + "px");
    events.draw_preview.call(this, this.connections[Math.floor((Math.random()*200)+1)].id);
  }
}


