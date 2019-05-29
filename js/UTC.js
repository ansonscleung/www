// Source: https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, p) 
{
    return n - p * Math.floor( n / p );
}

function timeChange(offset, round){
    offset = round ? mod(offset+(12*60), 24*60)-(12*60) : offset;
    //alert(offset);
    tzOffset = {hr: Math.floor(-offset/60), min: Math.floor(-offset%60)};
    $("#UTCtz").html((tzOffset.hr<0?"":"+") + tzOffset.hr + (tzOffset.min == 0?"":(":"+tzOffset.min.toString().padStart(2, '0'))));
};

$(document).ready(function($) {
    $.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
        icons: {
            time: 'far fa-clock',
            date: 'far fa-calendar',
            up: 'fas fa-chevron-up',
            down: 'fas fa-chevron-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'far fa-calendar-check-o',
            clear: 'far fa-trash',
            close: 'far fa-times'
        }
    });
    timeChange(moment.tz.zone(moment.tz.guess(true)).utcOffset(moment()), false);
    // Data source: https://academic.oup.com/sleep/article/31/2/185/2454134
    var sleep = moment.utc("00:32", "hh:mm");
    var wake = moment.utc("10:31", "hh:mm");
    var mid = moment.utc((sleep+wake)/2);
    console.log("Sleep time median: " + mid.format('HH:mm'));
    $.each(moment.tz.names(), function(key, value) {
        $('#tz_picker')
            .append($("<option></option>")
                    .attr("value",value)
                    .attr("data-tokens",value.replace(/[/_]/g, ' '))
                    .text(value));
    });
    $('select').selectpicker();
    var currtz = moment.tz.guess(true);
    $('#tz_picker').val(currtz).change();
    $('#bed_timepicker').datetimepicker({
        format: 'DD-MM-YYYY HH:mm',
        defaultDate: moment("00:32", "hh:mm")
    });
    $('#wake_timepicker').datetimepicker({
        useCurrent: false,
        format: 'DD-MM-YYYY HH:mm',
        defaultDate: moment("10:31", "hh:mm")
    });
    $('#tz_picker').on('change', function() {
        currtz = this.value;
        timeChange(moment.tz.zone(this.value).utcOffset(moment()), false);
        moment.tz.setDefault(currtz);
        $('#bed_timepicker').datetimepicker('date', moment.tz($('#bed_timepicker').datetimepicker('date'), currtz));
        $('#bed_timepicker').datetimepicker('date', moment.tz($('#bed_timepicker').datetimepicker('date'), currtz));
    });
    $("#bed_timepicker").on("change.datetimepicker", function (e) {
        $('#wake_timepicker').datetimepicker('minDate', e.date);
    });
    $("#wake_timepicker").on("change.datetimepicker", function (e) {
        $('#bed_timepicker').datetimepicker('maxDate', e.date);
    });
    $(document).on("click", "#submit", function () {
        var uSleep = moment.tz($('#bed_timepicker').datetimepicker('date'), currtz);
        var uWake = moment.tz($('#wake_timepicker').datetimepicker('date'), currtz);
        var uMid = moment.tz((uSleep+uWake)/2, currtz);
        console.log(currtz + ": " + uSleep.tz(currtz).format() + ", " + uWake.tz(currtz).format() + ", " + uMid.tz(currtz).format());
        console.log("User Sleep time median: " + uMid.tz(currtz).format('HH:mm'));
        console.log("User Sleep time median (UTC): " + moment.utc(uMid).format('HH:mm'));
        var dur = moment.duration(uMid.diff(mid));
        console.log("Sleep time offset: " + dur.hours() + ":" + dur.minutes().toString().padStart(2, '0'));
        timeChange(Math.round(dur.asMinutes()/60)*60, true);
        //alert(sleep.format('DD-MM-YYYY HH:mm') + ", " + wake.format('DD-MM-YYYY HH:mm') + ", " + moment((sleep+wake)/2).format('DD-MM-YYYY HH:mm') + ", " + mid.format('DD-MM-YYYY HH:mm') + "\nDiff: " + dur.asMinutes() + " " + dur.hours());
        $('#UTCModal').modal('hide');
    });
});