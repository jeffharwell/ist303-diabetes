var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },    

    registerEvents: function() {
        var self = this;
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
        // Register our event listeners
        self.registerEvents();

        // Initialize our Memore Store and render the home page
        this.store = new MemoryStore(function() {
            self.showAlert('Store Initialized', 'Info');
            $('body').html(new HomeView(self.store).render().el);
        });
    }

};

app.initialize();
