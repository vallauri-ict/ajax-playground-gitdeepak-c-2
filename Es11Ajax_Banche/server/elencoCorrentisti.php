<?php
    header("Content-type:application/json;charset=utf-8");
    require ("_libreria.php");
	
    if (!isset($_REQUEST["cFiliale"]))
    {
        http_response_code(422);
        die ("Parametro mancante (cFiliale).");
    }
    $con=_connection("4b_banche");
    $cFiliale = $con->real_escape_string($_REQUEST["cFiliale"]);
    if (!is_numeric($cFiliale))
    {
        $con->close();
        http_response_code(400);
        die ("Il parametro cFiliale deve essere numerico.");
    }
    $sql = "SELECT correntisti.cCorrentista, correntisti.nome AS nomeCorrentista, comuni.nome AS comuneCorrentista, telefono, cConto, saldo FROM correntisti INNER JOIN comuni ON correntisti.cComune = comuni.cComune INNER JOIN conti ON correntisti.cCorrentista = conti.cCorrentista WHERE cFiliale = $cFiliale;";
    $data = _eseguiQuery($con, $sql);
    echo json_encode($data);
    $con->close();
?>