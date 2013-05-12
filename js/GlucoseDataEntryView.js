var GlucoseDataEntryView = function(context) {

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

        $('body').html(GlucoseDataEntryView.template(context));
        this.bindListeners();
    };

    this.bindListeners = function() {
        console.log("Binding Event Listeners");
        $('#glucoseLevelSubmit').click(function(event) {
            console.log("You clicked me");
            var v = $('#level_input').val();
            console.log("Got Value 4: "+v); 
            var prandial_relationship = $('#prandial_select>option:selected').val();
            console.log("Value: "+v+" Prandial Relationship: "+prandial_relationship);
            if (v && $.isNumeric(v)) {
                context['glucoseValue'] = v;
                context['prandialRelationship'] = prandial_relationship
                context['contentStore'].writeGlucoseLevel(context, function() {window.location.hash = '';});
            } else {
                console.log("Invalid Input");
                $('#status_message').text("Not a Valid Glucose Level, please try again.");
                $('#status_message').css("background-color", "#FF8888");
            }
        });
    }

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();
}

GlucoseDataEntryView.template = Handlebars.compile($("#glucosedataentry-tpl").html());
