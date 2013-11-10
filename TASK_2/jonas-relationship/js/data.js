$console = $('div#console');

function addData_Initialize(data) {
	console.log('Init');
	var i = 0;
	while(i < limit) {
		$console.append('<div id="' + i + '" data-destinationPort="' + data.RECORDS[i].DestinationPort + '"><span class="timestamp">' + data.RECORDS[i].Timestamp + '</span> <span class="appName">' + data.RECORDS[i].AppName + '</span> <span class="source">' + data.RECORDS[i].Source + '</span> <span class="destinationPort">' + data.RECORDS[i].DestinationPort + '</span></div>');
		i++;
	}
}