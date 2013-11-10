url = "http://localhost:8888/fhp/relationship/data/network_raw_kim.json";
var relatioships;

// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function(data) {
  console.log( "--- success" );
  relatioships = data;
  console.log(relatioships);

  // addData_PerPlayer(log);

  //addData_Initialize(data);

})
  .done(function() {
    console.log( "--- done success" );
    dataLoaded(relatioships);
    
  })
  .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
      var error = document.createElement('table').appendChild(document.createTextNode('Daten können nicht geladen werden. (' + err + ')'));
      document.body.appendChild(error);
  })
  .always(function() {
    console.log( "--- always complete" );
  });
  
// Always on complete
jqxhr.complete(function() {
  console.log( "--- second complete" );
});