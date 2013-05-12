var PhysicalDataEntryView = function(context) {

    this.renderToBody = function() {
        if (context.entryType == "glucose") {
            context.title = "Glucose Level";
        } else if (context.entryType == "physical") {
            context.title = "Physical Activity";
        } else {
            // This is probably a bug and we should dump back to 
            // home
            window.location.hash = ''
            return;
        }
        console.log("Going to render entry for "+context.entryType);

        context.date = createDateDropdownArray();
        context.hour = createHourDropdownArray();
        context.minute = createMinuteDropdownArray();
        $('body').html(PhysicalDataEntryView.template(context));
        this.bindListeners();
    };

    this.bindListeners = function() {
        console.log("Binding Event Listeners");
        $('#physicalActivitySubmit').click(function(event) {
            var intensity = $('#intensity>option:selected').val();
            var type = $('#type>option:selected').val();
            var date_timestamp = $('#date>option:selected').val();
            var hour = $('#hour>option:selected').val();
            var minute = $('#minute>option:selected').val();
            context['intensity'] = intensity;
            context['type'] = type;
            context['timestamp'] = getTimestamp(date_timestamp, hour, minute);
            context['contentStore'].writePhysicalActivity(context, function() {window.location.hash = '';});
        });
    }

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();
}

PhysicalDataEntryView.template = Handlebars.compile($("#physicaldataentry-tpl").html());
