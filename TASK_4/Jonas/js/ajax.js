url = "data/ccc.json";
var tweets;

// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( url, function(data) {
  console.log( "--- success" );
  tweets = data;
  console.log(tweets);

})
  .done(function() {
    console.log( "--- done success" );
    addData_Initialize(tweets);
    
  })
  .fail(function( jqxhr, textStatus, error ) {
    console.log( "--- fail" );
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
