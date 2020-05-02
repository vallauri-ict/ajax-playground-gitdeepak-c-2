let apiKey = "&apikey=4GTDM1R962FYU16M",
    nCall = 0;

$(document).ready(function () {
    let _lstSymbol = $("#lstSymbol").prop("selectedIndex", -1),
        _txtMatchWord = $("#textMatchWord");
    nCall = 0;

    //creazione del grafico
    $.getJSON("http://localhost:3000/chart", function (data) {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, data);
    })

    //gestione onChange comboBox
    _lstSymbol.on("change", function () {
        let symbol = this.value.split(' - ')[1];
        $("#tabDati tbody").html("");
        if(nCall < 5) {
            getGlobalQuotes(symbol);
        }
        else
            alert("Limite richieste raggiunto!!");
    });

    //gestione keyup textbox
    _txtMatchWord.on("keyup", function () {
        if(_txtMatchWord.val().length > 1) {
            getSymbolSearch(_txtMatchWord.val());
            _txtMatchWord.val("");
        }
    });
});

function getGlobalQuotes(symbol) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + apiKey;
    $.getJSON(url,
        function (data) {
            let _table = $("#tabDati tbody");
            let globalQuoteData = data["Global Quote"],
                _tr = $("<tr>");
            $("<td>").text(globalQuoteData["01. symbol"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["08. previous close"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["02. open"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["05. price"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["07. latest trading day"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["09. change"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["04. low"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["03. high"]).appendTo(_tr);
            $("<td>").text(globalQuoteData["06. volume"]).appendTo(_tr);
            _tr.appendTo(_table);
            //$("#tabDati").DataTable();
        }
    );
    nCall++;
}

function getSymbolSearch(txt) {
    nCall++;
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + txt + apiKey;
    $.getJSON(url,
        function (data) {
            let symbolSearchData = data["bestMatches"],
                _table = $("#tabDati tbody");
            _table.html("");
            for (let i = 0; i < 3; i++) {
                if(nCall < 5) {
                    getGlobalQuotes(symbolSearchData[i]["1. symbol"]);
                }
                else {
                    alert("Limite richieste raggiunto!!");
                    return;
                }
            }
        }
    );
}