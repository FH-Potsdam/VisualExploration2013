<?php

if(isset($_POST['json'])){
	$postedData = $_POST['json'];
	$tempData = str_replace("\\", "",$postedData);
	//$cleanData = json_decode($tempData);
	$fp = fopen('results.json', 'w');
	fwrite($fp, $tempData);
	fclose($fp);
	//var_dump($cleanData);
	echo $tempData;
}

?>