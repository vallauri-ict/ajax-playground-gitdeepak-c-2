<?php

    header("Content-type:application/json;charset=utf-8");
    require ("_libreria.php");
	
    $con=_connection("4b_banche");
    
	$sql = "SELECT cBanca, nome FROM banche";
    $data = _eseguiQuery($con, $sql);
    echo json_encode($data);
    $con->close();

?>