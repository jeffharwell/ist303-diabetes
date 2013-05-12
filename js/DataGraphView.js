var DataGraphView = function(context) {

    this.render = function() {
        $('body').html(DataGraphView.template(context));
        this.drawGraph()
        this.bindListeners();
        return this;
    };

    this.drawGraph = function() {
        var series = [context.glucose_preprandial, context.glucose_postprandial, context.physical_line];
        var legend_labels = ['Preprandial Glucose', 'Postprandial Glucose', 'Physical Activity']
        $('#graph-wrapper').empty();
        $('#graph-wrapper').html('<div id="chartdiv"/>');
        $.jqplot('chartdiv',  series, 
            { 
                title:'Glucose Levels and Physical Activity',
                seriesDefaults: {
                    pointLabels:{ show:false },
                    showMarker:false
                },
                series:[
                    {},
                    {},
                    {pointLabels:{ show:true },
                     showLine:false,
                     showMarker:true,
                     color:"#FF0000",
                     yaxis:'y3axis'
                    }
                ],
                axes: {
                    xaxis:{
                        renderer:$.jqplot.DateAxisRenderer,
                        tickOptions:{formatString:'%b %#d'},
                        label:'Date'
                        },
                    yaxis:{
                        label:'Glucose Level'
                        },
                    y3axis:{
                        min:0,
                        max:6,
                        label:'Physical Intensity'
                    }
                },
                legend: {
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    show: true,
                    location: 'sw',
                    //yoffset: 25,
                    labels:legend_labels,
                    //placement: 'outside'
                }
            }
        );

    }

    this.bindListeners = function() {
        var self = this;
        $('#days_of_history').change(function() {
            var currentvalue = $('#days_of_history>option:selected').val();
            context["daysOfData"] = currentvalue;

            // I wonder if there is a better way to do this?
            //
            context['contentStore'].getGlucosePhysicalData(context, function(callback_context) {
                new DataGraphView(callback_context).drawGraph()});
        });

        window.addEventListener("orientationchange", function(event) {
                    if ($('#chartdiv').length == 0) {
                        console.log("Removing Orientation Event Listener");
                        this.removeEventListener("orientationchange",arguments.callee,false);
                    } else {
                        self.drawGraph()
                    }
                },
            false
        );

    }

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();

}

DataGraphView.template = Handlebars.compile($("#datagraphtemplate-tpl").html());
