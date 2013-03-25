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

        var match = hash.match(app.detailsURL);

        if (match) {
            console.log('Got a match');
            this.store.findById(Number(match[1]), function(employee) {
                $('body').html(new EmployeeView(employee).render().el)
            });
        }
    },

    registerEvents: function() {
        var self = this;
        // Event listener that listens to the URL has tag
        $(window).on('hashchanges', $.proxy(this.route, this));


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

        // Register our event listeners
        self.registerEvents();

        // Initialize our Memore Store and render the home page
        this.store = new MemoryStore(function() {
            self.showAlert('Store Initialized', 'Info');
            self.route();
        });
    }

};

app.initialize();
