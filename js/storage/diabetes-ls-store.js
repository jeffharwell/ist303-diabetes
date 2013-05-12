var DiabetesStorageStore = function(successCallback, errorCallback) {

    this.findByName = function(searchKey, callback) {
        var employees = JSON.parse(window.localStorage.getItem("employees"));
        var results = employees.filter(function(element) {
            var fullName = element.firstName + " " + element.lastName;
            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });
        callLater(callback, results);
    }

    this.findById = function(id, callback) {
        var employees = JSON.parse(window.localStorage.getItem("employees"));
        var employee = null;
        var l = employees.length;
        for (var i=0; i < l; i++) {
            if (employees[i].id === id) {
                employee = employees[i];
                break;
            }
        }
        callLater(callback, employee);
    }

    this.getAllPhysicalActivity = function(callback) {
        callLater(callback, JSON.parse(window.localStorage.getItem("physicalactivity")));
    }

    this.getAllGlucoseLevel = function(context, callback) {
        var d = JSON.parse(window.localStorage.getItem("glucoselevels"));
        getAllData(context, callback, d);
    }

    this.getAllPhysicalActivity = function(context, callback) {
        var d = JSON.parse(window.localStorage.getItem("physicalactivity"));
        getAllData(context, callback, d);
    }

    var getAllData = function(context, callback, d) {
        context['data'] = d;
        for (var i = 0; i < context.data.length; i++) {
            //console.log("Got Data "+d[i].timestamp+" "+d[i].level);
            var timestamp_obj = new Date(d[i].timestamp);
            d[i]['timestamp_object'] = timestamp_obj;

            // Build our user friendly date string
            var year = timestamp_obj.getFullYear();
            var month = timestamp_obj.getMonth() + 1;
            var day = timestamp_obj.getDate();
            var hour_and_suffix = amPm(timestamp_obj.getHours());
            var hour = hour_and_suffix.hour;
            var suffix = hour_and_suffix.suffix;
            var minute = timestamp_obj.getMinutes();
            d[i]['timestamp_string'] = month+"/"+day+"/"+year+" "+padZero(hour, 2)+":"+padZero(minute, 2)+" "+suffix;
        }
        d.reverse()
        callLater(callback, context);
    }

    this.getRangeGlucoseLevel = function(context, callback) {
        var days_to_show = context['daysOfData'];
        // First get the current unix timestamp
        var current_timestamp = Date.now()
        // Ok, now pull our days_to_show off of the current timestamp
        var cutoff_timestamp = current_timestamp - days_to_show*24*60*60*1000

        var d = JSON.parse(window.localStorage.getItem("glucoselevels"));
        context['data'] = [];
        for (var i = 0; i < d.length; i++) {
            // Check our cutoff, skip if it is before
            // of course if we are to show 'all' then we don't skip anything
            if (days_to_show != "all" && d[i].timestamp < cutoff_timestamp) {
                continue;
            }

            var timestamp_obj = new Date(d[i].timestamp);
            d[i]['timestamp_object'] = timestamp_obj;

            // Build our user friendly date string
            var year = timestamp_obj.getFullYear();
            var month = timestamp_obj.getMonth() + 1;
            var day = timestamp_obj.getDate();
            var hour_and_suffix = amPm(timestamp_obj.getHours());
            var hour = hour_and_suffix.hour;
            var suffix = hour_and_suffix.suffix;
            var minute = timestamp_obj.getMinutes();
            d[i]['timestamp_string'] = month+"/"+day+"/"+year+" "+padZero(hour, 2)+":"+padZero(minute, 2)+" "+suffix;

            context['data'].push(d[i]);
        }
        context['data'].reverse()
        callLater(callback, context);
    }

    this.getRangePhysicalActivity = function(context, callback) {
        var days_to_show = context['daysOfData'];
        // First get the current unix timestamp
        var current_timestamp = Date.now()
        // Ok, now pull our days_to_show off of the current timestamp
        var cutoff_timestamp = current_timestamp - days_to_show*24*60*60*1000

        var d = JSON.parse(window.localStorage.getItem("physicalactivity"));
        context['data'] = [];
        for (var i = 0; i < d.length; i++) {
            // Check our cutoff, skip if it is before
            // of course if we are to show 'all' then we don't skip anything
            if (days_to_show != "all" && d[i].timestamp < cutoff_timestamp) {
                continue;
            }

            var timestamp_obj = new Date(d[i].timestamp);
            d[i]['timestamp_object'] = timestamp_obj;

            // Build our user friendly date string
            var year = timestamp_obj.getFullYear();
            var month = timestamp_obj.getMonth() + 1;
            var day = timestamp_obj.getDate();
            var hour_and_suffix = amPm(timestamp_obj.getHours());
            var hour = hour_and_suffix.hour;
            var suffix = hour_and_suffix.suffix;
            var minute = timestamp_obj.getMinutes();
            d[i]['timestamp_string'] = month+"/"+day+"/"+year+" "+padZero(hour, 2)+":"+padZero(minute, 2)+" "+suffix;

            context['data'].push(d[i]);
        }
        context['data'].reverse()
        callLater(callback, context);
    }

    this.writePhysicalActivity = function(context, callback) {
        console.log("Sanity check in writePhysicalActivity");
        datetime_obj = new Date(context['timestamp']);
        console.log("Timestamp "+context['timestamp']+" = "+datetime_obj);
        addPhysicalActivity(context['intensity'], context['type'], context['timestamp'], callback)
    }

    this.writeGlucoseLevel = function(context, callback) {
        var glucose_value = context['glucoseValue'];
        var prandial_relationship = context['prandialRelationship'];
        console.log("Value: "+glucose_value+" Prandial Relationship: "+prandial_relationship);
        addGlucoseLevel(glucose_value, Date.now(), prandial_relationship);

        callLater(callback, context);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function(callback, data) {
        if (callback) {
            setTimeout(function() {
                callback(data);
            });
        }
    }

    var amPm = function(hour) {
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
        //console.log(hour+" "+suffix);
        return {
            hour: new_hour,
            suffix: suffix
        }
        /*
        return function() {
            this.hour = new_hour;
            this.suffix = suffix;
            console.log(new_hour);
        }
        */
    }


    var getRandomGlucoseValue = function() {
        // This is just a stub, look up the random function and 
        // implement something here
        var min = 100;
        var max = 200;
        return Math.floor(Math.random() * (max - min + 1)) + min;
        return 15;
    }

    var addGlucoseLevel = function(value, timestamp, prandial, callback) {
        var data = {"level": value, "timestamp": timestamp, "prandial": prandial};
        addData(data, "glucoselevels");
        callLater(callback);
    }

    var addPhysicalActivity = function(intensity, type, timestamp, callback) {
        var data = {"intensity": intensity, "type": type, "timestamp": timestamp};
        addData(data, "physicalactivity");
        callLater(callback);
    }

    var addData = function(data, datastore_name) {
        /*
         * This is the method that will take the data from the interface and 
         * add it to the web store
         */

        // Get the data from the data store
        var datastore = JSON.parse(window.localStorage.getItem(datastore_name));

        // Get the record ID and add it to the data
        var next_id = datastore.length;
        data['id'] = next_id

        // Now put the data in the data structure
        datastore.push(data);

        // Store the data structure back in the datastore
        window.localStorage.setItem(datastore_name, JSON.stringify(datastore));

        // Done
        callLater(successCallback);
    }


    /*
     * Construtor ... of sorts
     */

    // Initialize our data store if necessary
    if ( !window.localStorage.getItem("glucoselevels") || !window.localStorage.getItem("physicalactivity") ) {
        window.localStorage.setItem("glucoselevels", JSON.stringify([]));
        window.localStorage.setItem("physicalactivity", JSON.stringify([]));

        // Create our dummy data
        // Create a fake reading for the last 100 four hour intervals
        var current_unix_time = Date.now()
        var four_hours = 4*60*60*1000;
        var dates = [];
        var prandial;
        for (i=100; i>=0; i--) {
            if (i%2 == 0) {
                prandial = "preprandial";
            } else {
                prandial = "postprandial";
            }
            var new_date = current_unix_time - i*four_hours;
            addGlucoseLevel(getRandomGlucoseValue(), new_date, prandial)
        }
    }

    callLater(successCallback);
}
