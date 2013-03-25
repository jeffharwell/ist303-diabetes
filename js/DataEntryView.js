var DataEntryView = function(context) {

    this.render = function() {
        if (context.entryType == "glucose") {
            context.title = "Glucose Level";
        } else if (context.entryType == "physical") {
            context.title = "Physical Activity";
        } else {
            // This is probably a bug and we should dump back to 
            // home ... figure out how to do that later
            context.title = "Enter Data";
        }
        console.log("Going to render entry for "+context.entryType);
        this.el.html(DataEntryView.template(context));
        return this;
    };

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();

}

DataEntryView.template = Handlebars.compile($("#dataentry-tpl").html());
