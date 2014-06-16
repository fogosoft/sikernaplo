animateApp.directive('swipeEnabler', function() {
    return {
        restrict: 'E',
        scope: {
        },
        // ezt elerik mas controllerek is elvileg, ide kene tenni az after fuggvenyt
        controller: function($scope, $attrs, $http, $rootScope) {

            console.log("swipe directive inited");

            /* swipe */
            $("#fooldal").swipe({
                //Generic swipe handler for all directions
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    anim_jobbra("fooldal", "jobboldal");
                },
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    anim_balra("fooldal", "baloldal");
                },
                swipeUp: function(event, direction, distance, duration, fingerCount) {
                    anim_fel("fooldal", "alsooldal");
                },
                swipeDown: function(event, direction, distance, duration, fingerCount) {
                    anim_le("fooldal", "felsooldal");
                }

            });

            $("#felsooldal").swipe({
                //Generic swipe handler for all directions
                swipeUp: function(event, direction, distance, duration, fingerCount) {
                    anim_fel("felsooldal", "fooldal");
                }
            });

            $("#alsooldal").swipe({
                //Generic swipe handler for all directions
                swipeDown: function(event, direction, distance, duration, fingerCount) {
                    anim_le("alsooldal", "fooldal");
                }
            });

            $("#baloldal").swipe({
                //Generic swipe handler for all directions
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    anim_jobbra("baloldal", "fooldal");
                }
            });

            $("#jobboldal").swipe({
                //Generic swipe handler for all directions
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    anim_balra("jobboldal", "fooldal");
                }
            });

        },
        //the link method does the work of setting the directive
        // up, things like bindings, jquery calls, etc are done in here
        link: function(scope, elem, attr) {
            // scope is the directive's scope,
            // elem is a jquery lite (or jquery full) object for the directive root element.
            // attr is a dictionary of attributes on the directive element.



        },
        replace: true,
        template: ''
    };
});


