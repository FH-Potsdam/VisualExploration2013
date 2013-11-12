$console = $('div#console');

function addData_Initialize(data) {
	data.photos.forEach(drawElement);
	
}

function drawElement(element, index, array) {
    //console.log("a[" + index + "] = " + element);
    if(element.latitude != 0 || element.longitude != 0) {
    	latitude = parseFloat(element.latitude);
    	longitude = parseFloat(element.longitude);

    	//console.log(map(longitude,'long'), map(latitude,'lat'));
    	//console.log(Snap.rgb(element.color_avg[0],element.color_avg[1],element.color_avg[2]));

    	s.circle(map(longitude,'long'), map(latitude,'lat'), 5).attr({
    	    fill: Snap.rgb(element.color_avg[0],element.color_avg[1],element.color_avg[2])
    	})
        .data('url', element.url_q)
        .hover(function() { console.log(this.data('url'))});
    }
}
