<?php
include("countrylist.php");
$TOTAL_VOTES = 1300267; //till end 2013
if (!$link = mysql_connect('localhost', 'root', 'root')) {
	    echo 'Keine Verbindung zu mysql';
	    exit;
	}

	if (!mysql_select_db('myworld', $link)) {
	    echo 'Konnte Schema nicht selektieren';
	    exit;
	}


/*
$id_to_attr = array(
		"bar_gender_m" => "1",
		"bar_gender_w" => "2",
		"bar_source_sms" => "sms",
		"bar_source_website" => "website",
		"bar_source_offline" => "offline",
		"bar_source_apps" => "apps",
	);
*/

// INITIALIZING BOOLEANS: WHAT FILTER IST CLICKED?
// CLICKED ONE WILL NOT BE UPDATED. THE REST IS.
	$gender_clicked = 'false';
	$source_clicked = 'false';

	$filter_clicked = addslashes($_GET['clicked']); // something like 'bar_gender_m'
	
	if(substr($filter_clicked,0,10)=="bar_gender"){
		$gender_clicked='true';
		$gender_specific = "sms";
	}else if(substr($filter_clicked,0,10)=="bar_source"){
		$source_clicked='true';
	}

// CHECK INCOMING DATA
// WHAT SPECIFIC FILTERS ARE SWITCHED ON
	$gender_filter = "";
	$source_filter = "";
	$sql_gender ="";
	$sql_source ="";
	

	if($_GET['gender']){
		$gender_filter = addslashes($_GET['gender']);
		$sql_gender = "gender=" . $gender_filter;
	}
	if($_GET['source']){
		$source_filter = addslashes($_GET['source']);
		$sql_source = "source='" . $source_filter . "'";
	}	
	



	//$test_output = "gender_clicked: " . $gender_clicked . "source_clicked: " . $source_clicked;


// INITIALIZING RETURNING VARIABLES
	$count_sources = array();

// INITIALITING INCOMING VARIABLES (GET)
	// ...

// CONDITIONS
	// CONDITION GENDER
	
$where_clause = $sql_gender . " AND " . $sql_source;

$test_output = $where_clause;//"g: " . $gender_clicked . " s: " . $source_clicked;

	// SQL REQUEST
	/*
	if($gender_clicked===true){
		$sql = "SELECT source, COUNT(source)  FROM data_repl_noComma";
	}else if($source_clicked===true){
		$sql = "SELECT gender, COUNT(gender)  FROM data_repl_noComma";
	}
	*/

$test_count = 0;

$sql = "SELECT source, COUNT(source)  FROM myworld_doubleQuotesReplaced GROUP BY source"; //WHERE age = 12 AND country = 77 

$result = mysql_query($sql, $link);

if (!$result) {
    echo "DB Fehler, konnte die Datenbank nicht abfragen\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}


while ($row = mysql_fetch_assoc($result)) {

	$count_sources[] = array($row['source'] => $row['COUNT(source)']);

}	

function count_to_pixel($this_count,$sum,$m){
	$m = $m/100;
	$this_pixel = round(($this_count*100) / $sum) * $m;
	return $this_pixel;
}


echo json_encode(array(
	"source" => $count_sources
	)
);



mysql_free_result($result);

?>