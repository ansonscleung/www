$(function ($) {
    $.getJSON('src/quote.json', function(data) {
        quote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        $('#quote_eng').text(quote.quote.eng);
        $('#quote_chi').text(quote.quote.chi);
        $('#from_eng').text(quote.from.eng);
        $('#from_chi').text(quote.from.chi);
        $('#source_eng').text(quote.source.eng);
        $('#source_chi').text(quote.source.chi);

        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        //alert(moment(quote.date).format("D MMMM YYYY"));
        $('#date_eng').text(moment(quote.date).format("D MMMM YYYY"));
        $('#date_chi').text(moment(quote.date).format("YYYY[年]M[月]D[日]"));
    });
});
