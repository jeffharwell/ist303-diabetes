function padZero(s, max) {
    str = s.toString() // just in case
    // Taken from
    // http://stackoverflow.com/questions/6466135/adding-extra-zeros-in-front-of-a-number-using-jquery
    return str.length < max ? padZero("0" + str, max) : str;
}
function padSpace(s, max) {
    str = s.toString() // just in case
    return str.length < max ? padSpace(" " + str, max) : str;
}
function getTimestamp(date_timestamp, hour, minute) {
    console.log("date_timestamp = "+date_timestamp+", hour = "+hour+", minute = "+minute);
    var timestamp_obj = new Date(parseInt(date_timestamp));
    console.log(timestamp_obj);
    // Get the year, day, month
    var year = timestamp_obj.getFullYear();
    var month = timestamp_obj.getMonth();
    var day = timestamp_obj.getDate();
    console.log("Year "+year+" Month "+month+" Day "+day);

    // Ok, now we can create the correct timestame
    var correct_timestamp_obj = new Date(year, month, day, parseInt(hour), parseInt(minute), 0, 0);
    console.log(correct_timestamp_obj);

    // Return just the timestamp as seconds since the epoch
    return correct_timestamp_obj.getTime()
}
function createMinuteDropdownArray() {
    var d = [];
    var current_timestamp = Date.now();
    var timestamp_obj = new Date(current_timestamp);
    var minute = timestamp_obj.getMinutes();
    for (i = 0; i < 60; i++) {
        if (minute < 0) {
            minute = 59;
        }
        d.push({'minute':minute, 'minute-string':padZero(minute,2)});
        minute = minute - 1;
    }
    return d
}

function createHourDropdownArray() {
    var d = [];
    var current_timestamp = Date.now();
    var timestamp_obj = new Date(current_timestamp);
    var hour = timestamp_obj.getHours();
    for (i = 0; i < 24; i++) {
        if (hour < 0) {
            hour = 23;
        }
        d.push({'hour':hour, 'hour-string':amPm(hour)});
        hour--
    }
    return d
}
function createDateDropdownArray() {
    var d = [];
    var current_timestamp = Date.now();
    for (var i = 0; i < 30; i++) {
        timestamp = current_timestamp - i*24*60*60*1000;
        d.push({'timestamp':timestamp ,'year-month-day':getYearMonthDayString(timestamp)});
    }
    return d
}

function getYearMonthDayString(timestamp) {
    var timestamp_obj = new Date(timestamp);
    var year = timestamp_obj.getFullYear();
    var month = timestamp_obj.getMonth() + 1;
    var day = timestamp_obj.getDate();
    return year+"-"+month+"-"+day;
}

function amPm(hour) {
    // Really, you have got to be kidding
    //console.log("Got hour "+hour);
    var new_hour;
    var suffix = 'am';
    if (hour >= 12) {
        new_hour = hour - 12;
        suffix = 'pm';
    } else {
        new_hour = hour;
    }
    if (new_hour == 0) {
        new_hour = 12;
    }
    //console.log(hour+" "+suffix);
    return new_hour+" "+suffix
}

