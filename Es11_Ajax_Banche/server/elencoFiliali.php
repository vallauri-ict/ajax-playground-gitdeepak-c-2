<?php
    header("Content-type:application/json;charset=utf-8");
    require ("_libreria.php");
	
    if (!isset($_REQUEST["cBanca"]))
    {
        http_response_code(422);
        die ("Parametro mancante (cBanca).");
    }
    $con=_connection("4b_banche");
    $cBanca = $con->real_escape_string($_REQUEST["cBanca"]);
    if (!is_numeric($cBanca))
    {
        $con->close();
        http_response_code(400);
        die ("Il parametro cBanca deve essere numerico.");
    }
    $sql = "SELECT cFiliale, filiali.nome AS nomeFiliale, comuni.nome AS nomeComune FROM filiali INNER JOIN comuni ON filiali.cComune = comuni.cComune WHERE cBanca = $cBanca;";
    $data = _eseguiQuery($con, $sql);
    echo json_encode($data);
    $con->close();
?>