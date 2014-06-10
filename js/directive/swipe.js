animateApp.directive('swipeEnabler', function() {
    return {
        restrict: 'E',
        scope: {
        },
        // ezt elerik mas controllerek is elvileg, ide kene tenni az after fuggvenyt
        controller: function($scope, $attrs, $http, $rootScope) {

            console.log("swipe directive inited");

            $("body").swipe({
                //Generic swipe handler for all directions
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    console.log("mozgas jobbra, regiOldal:" + $rootScope.aktOldal);

                    if ($rootScope.aktOldal === 'mysuccess') {
                        window.location = "#";
                    } else if ($rootScope.aktOldal === 'dashboard') {
                        window.location = "#contact";
                    }


                },
                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    console.log("balra mozgas, regiOldal:" + $rootScope.aktOldal);

                    if ($rootScope.aktOldal === 'myteam') {
                        window.location = "#";
                    } else if ($rootScope.aktOldal === 'dashboard') {
                        window.location = "#about";
                    }

                },
                swipeUp: function(event, direction, distance, duration, fingerCount) {
                    anim_fel("fooldal", "alsooldal");
                },
                swipeDown: function(event, direction, distance, duration, fingerCount) {
                    anim_le("fooldal", "felsooldal");
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


