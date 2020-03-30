"use strict";

$(function () {
	let _wFiliali=$("#wrapFiliali");
	let _wCorrentisti= $("#wrapCorrentisti");
    let _lstBanche = $("#lstBanche");
	let _lstFiliali = $("#lstFiliali");

    //_wFiliali.css("display", "none");
	_wCorrentisti.css("display", "none");
	
    //gestione banche
    let _richiestaBanche = inviaRichiesta("GET", "server/elencoBanche.php" );
	_richiestaBanche.fail(error);
    _richiestaBanche.done(function (data) {
        console.log(data);
		_wFiliali.css("display", "block");
        for (let banca of data) {
            $("<option>", {
                "value": banca["cBanca"],
                "text": banca["nome"]
            }).appendTo(_lstBanche);
        }
        _lstBanche.prop("selectedIndex", -1);
    });
   

    //gestione filiali
    _lstBanche.on("change", function () { 
		_lstFiliali.html("");	
        _wCorrentisti.css("display", "none");        
        let cBanca = this.value;
		
        let _richiestaFiliali = inviaRichiesta("POST", "server/elencoFiliali.php",  "cBanca=" + cBanca);
        _richiestaFiliali.fail(error);
        _richiestaFiliali.done(function (data) {
            _wFiliali.css("display", "block");
            for (let record of data)
                $("<option>", {
                    "value": record["cFiliale"],
                    "text": record["nomeFiliale"] + " - " + record["nomeComune"]
                }).appendTo(_lstFiliali);
            _lstFiliali.prop("selectedIndex", -1);
			
			_lstFiliali.on("change", function () {
                let _richiestaCorrentisti = inviaRichiesta("POST", "server/elencoCorrentisti.php", "cFiliale=" + this.value);
				_richiestaCorrentisti.fail(error);
                _richiestaCorrentisti.done(function (data) {
					_wCorrentisti.css("display", "block");
                    let _table = $("#tabCorrentisti tbody");
                    _table.html("");
                    for (let record of data) {
                        let _tr = $("<tr>");
                        for (let key in record)
                            $("<td>", {
                                "text": record[key]
                            }).appendTo(_tr);
                        _tr.appendTo(_table);
                    }
                    $("#tabCorrentisti").DataTable();
                });
                
            });
            
        });
    });

});