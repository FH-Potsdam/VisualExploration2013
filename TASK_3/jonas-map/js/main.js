var $g = $('#gallery');

var minInLat = 90;
var maxInLat = -90;
var minOutLat = 0;
var maxOutLat = 400;

var minInLong = -180;
var maxInLong = 180;
var minOutLong = 0;
var maxOutLong = 800;

s = Snap(maxOutLong, maxOutLat);

var auswahl = s.rect(0, 0, 0, 0).attr( { stroke: '#1693A5', fill: 'transparent', strokeWidth: 0.5 } );

$(document).mousedown(function() {
    auswahl.attr( { x: event.pageX, y: event.pageY, width: 1, height: 1 } );
}).bind('mousemove', function() {
	(event.which == 1) ? drawAuswahl(event) : '';
	(event.which == 1) ? displayPictures(remap(auswahl.attr('x'),'long'), remap(auswahl.attr('y'),'lat'), remap(event.pageX,'long'), remap(event.pageY,'lat')) : '';
})
.bind('mouseup mouseleave', function() {
    drawAuswahl(event);

    displayPictures(remap(auswahl.attr('x'),'long'), remap(auswahl.attr('y'),'lat'), remap(event.pageX,'long'), remap(event.pageY,'lat'));
});

function drawAuswahl (event) {
	var x = (event.pageX > maxOutLong) ? maxOutLong : event.pageX;
	var y = (event.pageY > maxOutLat) ? maxOutLat : event.pageY;

    auswahl.attr( { width: x - auswahl.attr('x'), height: y - auswahl.attr('y') } );
}

function displayPictures (x, y, width, height) {
	var items = [];
	$g.html('');
	
	$.each( pictues.photos, function( key, element ) {
		var longitude = parseFloat(element.longitude);
		var latitude = parseFloat(element.latitude);

		if(latitude != 0 && longitude != 0) {
			if(longitude >= x && longitude <= width && latitude <= y && latitude >= height) {
				var s = element.url_q.split("/");
				items.push( '<img width="40" height="40" style="border:10px solid rgb(' + element.color_avg[0] + ',' + element.color_avg[1] + ',' + element.color_avg[2] + ')" src="images/'+s[s.length-1]+'">' );	
			}
		}
	});

	$g.append($( '<div>', {
		html: items.join( '' )
	}));
}

function map (value, dimension) {
	var dimension = dimension  || 'lat';
	if(dimension == 'lat') {
		dimension = (dimension < minInLat) ? minInLat : dimension;
		dimension = (dimension > maxInLat) ? maxInLat : dimension;
	}
	else {
		dimension = (dimension < minInLong) ? minInLat : dimension;
		dimension = (dimension > maxInLong) ? maxInLat : dimension;
	}
	return (dimension == 'lat') ? (((maxOutLat-minOutLat)*((value-minInLat)/(maxInLat-minInLat)))+minOutLat).toFixed(0) : (((maxOutLong-minOutLong)*((value-minInLong)/(maxInLong-minInLong)))+minOutLong).toFixed(0);
}

function remap (value, dimension) {
	var dimension = dimension  || 'lat';
	return (dimension == 'lat') ? (((maxInLat-minInLat)*((value-minOutLat)/(maxOutLat-minOutLat)))+minInLat).toFixed(0) : (((maxInLong-minInLong)*((value-minOutLong)/(maxOutLong-minOutLong)))+minInLong).toFixed(0);
}