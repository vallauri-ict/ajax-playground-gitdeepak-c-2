let apiKey = "&apikey=4GTDM1R962FYU16M",
    nCall = 0,
    _myChart = $("#myChart");

$(document).ready(function () {
    let _lstSymbol = $("#lstSymbol").prop("selectedIndex", -1),
        _txtMatchWord = $("#textMatchWord"),
        _lstSector = $("#lstSector"),
        btnSave = $("#saveChart"),
        ctx;

    nCall = 0,
    btnSave.hide();

    //creazione del grafico iniziale
    $.getJSON("http://localhost:3000/chart", function (data) {
        if(!ctx) {
            ctx = creaGrafico("http://localhost:3000/chart");
            _myChart = new Chart(ctx, data);
            $.getJSON("http://localhost:3000/SECTOR", function (data) {
                modificaDatiGrafico(_myChart, data["Rank H: 3 Year Performance"]);
            });
            btnSave.show();
        }
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

    caricaComboBoxSector(_lstSector);
    //gestione onChange comboBox sector
    _lstSector.on("change", function () {
        $(".container h2").html(this.value + "<br>Graphic");
        $.getJSON("http://localhost:3000/SECTOR", function (data) {
            modificaDatiGrafico(_myChart, data[$(_lstSector).val()]);
        });
    });

    //gestione click bottone
    btnSave.on("click", function () {
        btnSave.attr("href", _myChart.toBase64Image());
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

function caricaComboBoxSector(lst) {
    $.getJSON("http://localhost:3000/SECTOR", function (data) {
        for (let key in data){
            if(key != "Meta Data") {
                $("<option>", {
                    text: key,
                    class: "dropdown-item",
                    value: key,
                    appendTo: lst
                });
            }
        }
    });
}

function creaGrafico(url) {
    let _data;
    $.getJSON(url, function (data) {
        _data = data;
    });
    let chart = new Chart($("#myChart"), _data);
    return chart;
}

function modificaDatiGrafico(chart, data) {
    let dataChart = chart["data"];
    dataChart["labels"] = [];
    let dataset = dataChart["datasets"][0];
    dataset["data"] = [];
    for (let key in data) {
        dataChart["labels"].push(key);
        dataset["data"].push(data[key].replace("%", ""));
        let color = "rgba(" + Random(0, 255) + ", " + Random(0, 255) + ", " + Random(0, 255) + ", 0.9)";
        dataset["backgroundColor"].push(color);
        dataset["borderColor"].push(color);
    }
    chart.update();
}

function Random(max, min) {
    return Math.floor(((max - min) + 1) * Math.random()) + min;
}