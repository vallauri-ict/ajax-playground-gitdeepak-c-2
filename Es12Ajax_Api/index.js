$(document).ready(function () {
    let _lstSymbol = $("#lstSymbol").prop("selectedIndex", -1),
        _txtMatchWord = $("#textMatchWord");

    //gestione onChange comboBox
    _lstSymbol.on("change", function () {
        let symbol = this.value.split(' - ')[1];
        getGlobalQuotes(symbol);
    });

    _txtMatchWord.on("keyup", function () {
        if(_txtMatchWord.val().length > 1) {
            getSymbolSearch(_txtMatchWord.val());
        }
    });
});

function getGlobalQuotes(symbol) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=4GTDM1R962FYU16M";
    $.getJSON(url,
        function (data) {
            let _table = $("#tabDati tbody");
            _table.html("");
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
}

function getSymbolSearch(txt) {
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + txt + "&apikey=4GTDM1R962FYU16M";
    $.getJSON(url,
        function (data) {
            let symbolSearchData = data["bestMatches"],
                _table = $("#tabDati tbody");
            _table.html("");
            for (let i = 0; i < symbolSearchData.length; i++) {
                let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbolSearchData[i]["1. symbol"] + "&apikey=4GTDM1R962FYU16M";
                $.getJSON(url,
                    function (vet) {
                        let globalQuoteData = vet["Global Quote"],
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
                    });
            }
        }
    );
}