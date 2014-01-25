<?php
//include("countrylist.php");

if (!$link = mysql_connect('localhost', 'root', 'root')) {
	    echo 'Keine Verbindung zu mysql';
	    exit;
	}

	if (!mysql_select_db('myworld', $link)) {
	    echo 'Konnte Schema nicht selektieren';
	    exit;
	}

	
$filter_gender2 = addslashes($_GET['gender']);
$sql = "SELECT gender  FROM data_repl_noComma WHERE gender = '$filter_gender2'";

$result = mysql_query($sql, $link);

if (!$result) {
    echo "DB Fehler, konnte die Datenbank nicht abfragen\n";
    echo 'MySQL Error: ' . mysql_error();
    exit;
}

// COUNTING VARIABLES
// FOR THE INTERACTIVE BAR CHARTS
$count_gender_female = 0;
$count_gender_male = 0;
$count_gender_noGender = 0;
$count_gender_sum = 0;


while ($row = mysql_fetch_assoc($result)) {
	$this_gender = $row['gender'];
	
	if($this_gender==1){
		$count_gender_male++;
	}
	else if($this_gender==2)
	{
		$count_gender_female++;
	}else{
		$count_gender_noGender++;
	}

}	
$count_gender_sum = $count_gender_male + $count_gender_female; // + $count_gender_noGender;
//echo $count_gender_male . " + " . $count_gender_female . " + " . $count_gender_noGender . " = " . $count_gender_sum . "</br>";

$value_gender_m = round(($count_gender_male * 100) / $count_gender_sum) * 4.5;

//echo $value_m;
$value_gender_w = 450 - $value_gender_m;

//echo $value_gender_m . " " . $value_gender_w;


mysql_free_result($result);

?>