var DataTableView = function(context) {

    this.render = function() {
        if (context.entryType == "glucose") {
            context.title = "Glucose Level";
        } else if (context.entryType == "physical") {
            context.title = "Physical Activity";
        } else {
            // This is probably a bug and we should dump back to 
            // home
            window.location.hash = '';
            return;
        }
        console.log("Going to render entry for "+context.entryType);
        $('body').html(DataTableView.template(context));
        $('#table-data').html(DataTableView.tableTemplate(context));
        this.bindListeners();
        return this;
    };

    this.refreshTable = function() {
        $('#table-data').html(DataTableView.tableTemplate(context));
    };

    this.bindListeners = function() {
        $('#days_of_history').change(function() {
            var currentvalue = $('#days_of_history>option:selected').val();
            context["daysOfData"] = currentvalue;

            // I wonder if there is a better way to do this?
            context['contentStore'].getRangeGlucoseLevel(context, function(callback_context) {
                new DataTableView(callback_context).refreshTable()});
        });
    }

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();

}

DataTableView.template = Handlebars.compile($("#datatable-tpl").html());
DataTableView.tableTemplate = Handlebars.compile($("#tabletemplate-tpl").html());
