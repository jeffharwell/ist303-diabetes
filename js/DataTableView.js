var DataTableView = function(context) {

    this.render = function() {
        console.log("Going to render entry for "+context.entryType);
        var table_html;
        if (context.entryType == "glucose") {
            console.log("Viewing Glucose Data");
            context.title = "Glucose Level";
            table_html = DataTableView.tableTemplate(context);
        } else if (context.entryType == "physical") {
            console.log("Viewing Physical Activity");
            context.title = "Physical Activity";
            table_html = DataTableView.physicalTableTemplate(context);
        } else {
            // This is probably a bug and we should dump back to 
            // home
            window.location.hash = '';
            return;
        }
        $('body').html(DataTableView.template(context));
        $('#table-data').html(table_html);
        this.bindListeners();
        return this;
    };

    this.refreshTable = function() {
        if (context.entryType == "glucose") {
            $('#table-data').html(DataTableView.tableTemplate(context));
        } else if (context.entryType == "physical") {
            $('#table-data').html(DataTableView.physicalTableTemplate(context));
        }
    };

    this.bindListeners = function() {
        $('#days_of_history').change(function() {
            var currentvalue = $('#days_of_history>option:selected').val();
            context["daysOfData"] = currentvalue;

            // I wonder if there is a better way to do this?
            //
            if (context.entryType == "glucose") {
                context['contentStore'].getRangeGlucoseLevel(context, function(callback_context) {
                    new DataTableView(callback_context).refreshTable()});
            } else if (context.entryType == "physical") {
                context['contentStore'].getRangePhysicalActivity(context, function(callback_context) {
                    new DataTableView(callback_context).refreshTable()});
            }
        });
    }

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();

}

DataTableView.template = Handlebars.compile($("#datatable-tpl").html());
DataTableView.tableTemplate = Handlebars.compile($("#tabletemplate-tpl").html());
DataTableView.physicalTableTemplate = Handlebars.compile($("#physicaltabletemplate-tpl").html());
