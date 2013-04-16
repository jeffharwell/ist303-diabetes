var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },    

    route: function() {
        console.log('app.route() Called');
        var hash = window.location.hash;
        console.log('Hash is '+hash);
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }

        /* The Old Employee Directory Demo Code */
        var match = hash.match(app.detailsURL);

        if (match) {
            console.log('Got a match Employee Directory');
            console.log('Looking for '+match[1]);
            this.store.findById(Number(match[1]), function(employee) {
                $('body').html(new EmployeeView(employee).render().el)
            });
            return;
        }

        /* Data Entry */
        match = hash.match(app.entryURL);

        if (match) {
            console.log('Got a match for Data Entry');
            console.log('Looking for '+match[1]);
            var context = {entryType: match[1]};
            $('body').html(new DataEntryView(context).render().el);
            return;
        }

        /* Data Viewing */
        match = hash.match(app.viewURL);

        if (match) {
            console.log('Got a match for Data Viewing');
            console.log('Looking for context '+match[1]);
            var context = {entryType: match[1]}
            this.store.getAllGlucoseLevel(context, function(callback_context) {
                $('body').html(new DataTableView(callback_context).render().el);
            });
            return;
        }
    },

    registerEvents: function() {
        var self = this;
        // Event listener that listens to the URL has tag
        $(window).on('hashchange', $.proxy(this.route, this));


        // Check if the browser supports touch events
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // yes, so register our touch event listener
            $('body').on('touchstart', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            // no touch support, so we just enable the mouse instead
            $('body').on('mousedown', 'a', function(event) {
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup', 'a', function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } 
    },

    initialize: function() {
        var self = this;
        
        // regular expression that matches employee details urls
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.entryURL = /^#enter\/(glucose|physical)/;
        this.viewURL = /^#view\/(glucose|physical)/;

        // Register our event listeners
        self.registerEvents();

        // Initialize our Memore Store and render the home page
        this.store = new DiabetesStorageStore(function() {
            self.showAlert('Store Initialized', 'Info');
            self.route();
        });
    }

};

app.initialize();
