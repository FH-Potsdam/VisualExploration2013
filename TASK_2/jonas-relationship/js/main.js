var s = Snap("#canvas");

s = Snap(800, 800);

var minIn = 9 * 1;
var maxIn = 9 * 5;
var minOut = 10;
var maxOut = 600;

var names = new Array();

function dataLoaded () {
	//console.log(getData_getLoveFrom('Alice','Fred'));

	s.path('M ' + minOut + ' ' + minOut + ' L ' + maxOut + ' ' + maxOut).attr( { stroke: '#000', fill: 'none', 'stroke-width': .3, 'fill-opacity': 1 } );

	s.path('M ' + minOut + ' ' + minOut + ' L ' + minOut + ' ' + maxOut).attr( { stroke: '#000', fill: 'none', 'stroke-width': .8, 'fill-opacity': 1 } );

	s.path('M ' + minOut + ' ' + minOut + ' L ' + maxOut + ' ' + minOut).attr( { stroke: '#000', fill: 'none', 'stroke-width': .8, 'fill-opacity': 1 } );

	s.text( minOut-10, maxOut+20, 'Love').attr( {
    	'font-size': '0.8em',
    	'fill': '#1693A5'
	} );

	s.text( maxOut+10, minOut+5, 'Karma').attr( {
    	'font-size': '0.8em',
    	'fill': '#FBB829'
	} );

	$.each(relatioships, function(k, v) {
		var love = parseInt(remap(getData_LoveValue(k)));
		var karma = parseInt(remap(getData_KarmaValue(k)));

		names[k] = { id: k,
			name : s.text( love, karma, k),
			love : s.rect(love, karma + 2, 5, 5),
			karma : s.rect(love, karma + 8, 5, 5)
		};

		names[k].name.attr( { 'font-size': '0.7em' } ).data('name', k);

		names[k].love.attr( { 'fill': '#1693A5' } );

		names[k].karma.attr( { 'fill': '#FBB829' } );
		

		names[k].name.hover(function() {
			this.attr( { fill:'#1693A5', cursor: 'pointer' } );
			console.log(this.data('name'));

			changeLove(this.data('name'));
			
		}, function() {
			this.attr( { fill:'#000' } );
		})
		
		//console.log(remap(getData_LoveValue(k)));
		//console.log(remap(getData_KarmaValue(k)));
	});
}

function changeLove (person) {

	for(key in names) {
		console.log(getData_getLoveFrom(person, names[key].id), person, names[key].id);
		names[key].love.animate({'width': getData_getLoveFrom(person, names[key].id)*4}, 500);
		names[key].karma.animate({'width': getData_getLoveFrom(names[key].id, person)*4}, 500);
	}
}

function getData_getLoveFrom (person1, person2) {
	return reValue(relatioships[person1][person2]);
}

function getData_LoveValue (name) {
	console.log('-- getData_LoveValue');
	var counter = 0;
	for(var i in relatioships[name]) {
		counter += reValue(relatioships[name][i]);
		//console.log(relatioships[name][i]);
	}
	console.log('-- getData_LoveValue: ' + counter);
	return counter;
}

function getData_KarmaValue (name) {
	console.log('-- getData_KarmaValue');
	var counter = 0;
	
	for(var i in relatioships) {
		counter += reValue(relatioships[i][name]);
		//console.log(relatioships[i][name]);
	}
	console.log('-- getData_LoveValue: ' + counter);
	return counter;
}

function reValue (value) {
	if(value == 0) { return 0; }
	else if(value == 1) { return 3; }
	else if(value == 2) { return 4; }
	else if(value == 3) { return 1; }
	else if(value == 4) { return 5; }
	else { return 2; }
}

function remap (value) {
	return (((maxOut-minOut)*((value-minIn)/(maxIn-minIn)))+minOut).toFixed(0);
}