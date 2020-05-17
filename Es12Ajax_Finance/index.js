let apiKey = "&apikey=4GTDM1R962FYU16M",
    nCall = 0,
    _myChart = $("#myChart");

$(document).ready(function () {
    let _lstSymbol = $("#lstSymbol").prop("selectedIndex", -1),
        _txtMatchWord = $("#textMatchWord"),
        _lstSector = $("#lstSector"),
        btnSave = $("#saveChart"),
        btnUpload = $("#uploadChart"),
        ctx;

    $("#wrapperUpload").hide();
    //gestione upload
    const credentialKeys = {
        clientId: "269699838782-3mhv4g31ocujaksfc2sn4eamigt9aspj.apps.googleusercontent.com",
        token: "https://oauth2.googleapis.com/token",
        redirect_uri: "http://localhost:8686",
        scope: "https://www.googleapis.com/auth/drive",
        client_secret: "DfuJ79_jJ77YY752SQTMvPM9",
        accessToken: ""
    };
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if(localStorage.getItem("accessFlag") != null) {
        setTokens(credentialKeys["clientId"], credentialKeys["client_secret"], credentialKeys["redirect_uri"], credentialKeys["scope"], code);
    }

    nCall = 0,
    btnSave.hide();
    btnUpload.hide();

    //creazione del grafico iniziale
    $.getJSON("http://localhost:3000/chart", function (data) {
        if(!ctx) {
            ctx = creaGrafico("http://localhost:3000/chart");
            _myChart = new Chart(ctx, data);
            $.getJSON("http://localhost:3000/SECTOR", function (data) {
                modificaDatiGrafico(_myChart, data["Rank H: 3 Year Performance"]);
            });
            btnSave.show();
            btnUpload.show();
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

    //aggiorna con nome file alla selezione
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
    //Drive upload
    btnUpload.on("click", function () {
        if(localStorage.getItem("accessToken") == null) {
            signIn(credentialKeys["clientId"], credentialKeys["client_secret"], credentialKeys["redirect_uri"], credentialKeys["scope"]);
            let accessFlag = "false";
            localStorage.setItem("accessFlag", accessFlag);
        }
        else {
            $("#wrapperUpload").show("slow", "linear");
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#wrapperUpload").offset().top
            }, 2000, function () {
                $("#upload").on("click", function (e) {
                    carica();
                    $("#frameContainer").hide("slow", "linear");
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(".container").offset().top
                    }, 2000);
                });
            }
        )}
    });
});

function carica() {
    if($("#customFile").val() != ""){
        let file = $("#customFile")[0].files[0];
        let upload = new Upload(file).doUpload();
        upload.done(function (data)
        {
            alert("Caricamento su Google Drive effettuato correttamente");
            $("label[for=customFile]").text("Choose your file");
            $("#driveFile").val("");
            $("#wrapperUpload").hide("slow", "linear");
            $([document.documentElement, document.body]).animate({
                scrollTop: $(".container").offset().top
            }, 2000);
        });
        upload.fail(function ()
        {
            alert("Errore nel caricamento!");
        });
    }
    else
    {
        alert("Selezionare un file prima!!");
    }
}

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