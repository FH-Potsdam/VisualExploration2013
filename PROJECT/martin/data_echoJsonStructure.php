<?php
	//echo $_GET["max"];

	include("hdi_list.php");
	include("countrylist.php");
	//include('data_echoSuggestedPriorities.php'); //to get $sugg_output

	//kopiert aus incom
	if (!$link = mysql_connect('localhost', 'root', 'root')) {
	    echo 'Keine Verbindung zu mysql';
	    exit;
	}

	if (!mysql_select_db('myworld', $link)) {
	    echo 'Konnte Schema nicht selektieren';
	    exit;
	}

	$filter_gender = addslashes($_GET['noGender']);
	$filter_source = addslashes($_GET['source']);

	$sql = "SELECT country, COUNT(country)  FROM data_repl_noComma WHERE gender !=  '$filter_gender' AND source = '$filter_source' GROUP BY country"; //WHERE gender!="'.$filter_gender.'"
	
	//$sql    = 'SELECT * FROM data2012_13_repl AS myworlddata WHERE country = "'.$_GET["country"].'" LIMIT 0,'.$_GET["max"];

	$result = mysql_query($sql, $link);

	if (!$result) {
	    echo "DB Fehler, konnte die Datenbank nicht abfragen\n";
	    echo 'MySQL Error: ' . mysql_error();
	    exit;
	}

	$all_results = array();

	$arr_low = array();
	$arr_medium = array();
	$arr_high = array();
	$arr_veryHigh = array();
	$arr_undefined = array();

	/*session_start();
	$_SESSION['test_output'] = "<br/><br/>This is test_output from echoJesonStructure.php to content.php";
	*/

	$countries_in_selection = array();
	$count_entries_in_selection = 0;

	while ($row = mysql_fetch_assoc($result)) {



		$count = $row['COUNT(country)'];
		$country = $row['country'];

		$country_name = $countries[$country]; //convert country index to country name (by countrylist.php)

		
		//SHOW JUST COUNTRIES WITH MORE THAN 1000 PARTICIPANTS
		if ($count >= $_GET["min_participants"] && $count <= $_GET["max_participants"]) {

			$countries_in_selection[] = $country;
			
			$count_entries_in_selection += $row['COUNT(country)'];

			// GET HDI_CATEGORY AND
			// PUT ROW INTO ARRAY
			if(in_array($country, $low)){
				$category="low";
				$arr_low[] = array('name' => $country_name, 'value' => $count);
			}else if(in_array($country, $medium)){
				$category="medium";
				$arr_medium[] = array('name' => $country_name, 'value' => $count);
			}else if(in_array($country, $high)){
				$category="high";
				$arr_high[] = array('name' => $country_name, 'value' => $count);
			}else if(in_array($country, $veryHigh)){
				$category="very High";
				$arr_veryHigh[] = array('name' => $country_name, 'value' => $count);
			}else{
				$category="undefined";
				$arr_undefined[] = array('name' => $country_name, 'value' => $count);
			}
		}
	}

	session_start();
	$_SESSION['countries_selected'] = $countries_in_selection;
	$_SESSION['count_entries_in_selection'] = $count_entries_in_selection;
	$_SESSION['filter_gen'] = $filter_gender;
	$_SESSION['filter_src'] = $filter_source;

$arr = array(
	'name' => 'world', 
	'children' => array(
		array(
			'name' => 'low',
			'children' => $arr_low
		),
		array(
			'name' => 'medium',
			'children' => $arr_medium
		),
		array(
			'name' => 'high',
			'children' => $arr_high
		),
		array(
			'name' => 'very high',
			'children' => $arr_veryHigh
		),
		array(
			'name' => 'undefined',
			'children' => $arr_undefined
		),
	)
); 

echo json_encode($arr);

mysql_free_result($result);


?>
