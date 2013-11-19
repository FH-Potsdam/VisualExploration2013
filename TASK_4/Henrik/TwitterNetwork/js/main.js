// make a new graph
var graph = new Springy.Graph();
var nodes = new Array();

var mainNode = graph.newNode({label: 'Eric Schmidt'});
$.getJSON( "js/data.json", function( data ) {
	for(var i = 0; i < data.length; i++){
		nodes[i]  = graph.newNode({label: data[i].name});
		graph.newEdge(mainNode, nodes[i]);
	}
	createEdges(data);
});

var createEdges = function (data){
	for(var i = 0; i < data.length; i++){
		for(var u = 0; u < data[i].following.length; u++){
			for(var x = 0; x < data.length; x++){
				if(data[x].user == data[i].following[u].user){
					graph.newEdge(nodes[i],nodes[x]);
				}
			}
		}
	}
} 