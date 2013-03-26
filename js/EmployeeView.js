var EmployeeView = function(employee) {

    this.render = function() {
        console.log("Looking at "+employee.firstName);
        this.el.html(EmployeeView.template(employee));
        return this;
    };

    this.initialize = function() {
        this.el = $('<div/>');
    };

    this.initialize();

}

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());
