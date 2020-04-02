$(document).ready(function () {
    getGlobalQuotes("IBM");
});

function getGlobalQuotes(symbol) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=4GTDM1R962FYU16M";
    $.getJSON(url,
        function (data) {
            $("#symbol").text(data["Global Quote"]["01. symbol"]);
            let globalQuoteData = data["Global Quote"];
            $("#previousClose").text(globalQuoteData["08. previous close"]);
            $("#open").text(globalQuoteData["02. open"]);
            $("#lastTrade").text(globalQuoteData["05. price"]);
            $("#lastTradeTime").text(globalQuoteData["07. latest trading day"]);
            $("#change").text(globalQuoteData["09. change"]);
            $("#daysLow").text(globalQuoteData["04. low"]);
            $("#daysHigh").text(globalQuoteData["03. high"]);
            $("#volume").text(globalQuoteData["06. volume"]);
        }
    );
}