animateApp.directive('menuComponent', function() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: function($scope, $attrs, $http, $rootScope) {

            $scope.currentUser = {
                "username": "anonym"
            };

            $rootScope.$on("user_ok", function(event, data) {
                console.log("user_ok hivodott:" + data.currentUser);
                $scope.currentUser = data.currentUser;
            });

            $scope.sessionCheck = function() {
                console.log("session check indul");
                $http.get(server_nodeurl + "/testsikerBE/aktUser").success(function(data) {
                    console.log("aktuser válasz:" + data);

                    if (data === 'false') {
                        console.log("redir if:" + window.location.pathname);
                        if (window.location.pathname.indexOf('login') === -1) {
                            window.location = '#';
                            console.log("redir");
                        } else {
                            console.log("már a login oldalon vagyunk");
                        }
                    } else {
                        $scope.currentUser = data;
                        $rootScope.currentUser = data;
                        $rootScope.$broadcast("user_ok", {
                            currentUser: data
                        });
                    }


                }).error(function(data, status, headers, config) {
                    console.log("rossz login válasz:" + data);
                });
            };

            $scope.sessionCheck();

            $scope.kilepes = function() {
                $http.get(server_nodeurl + "/testsikerBE/logout").success(function(data) {
                    console.log("aktuser válasz:" + data);
                    //redirectUser();
                }).error(function(data, status, headers, config) {
                    console.log("rossz logout válasz:" + data);
                });
            };
        },
        link: function(scope, elem, attr) {

        },
        replace: true,
        templateUrl: 'js/template/menu.html'
    };
});


