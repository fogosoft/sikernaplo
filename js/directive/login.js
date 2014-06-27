animateApp.directive('loginEnabler', function() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: function($scope, $attrs, $http, $rootScope) {

            console.log("login directive here");

            $scope.login = {email: '', password: '', error: ''};
            $scope.loginInProgress = false;

            $scope.loginUser = function() {
                console.log("loginUser");
                $scope.loginInProgress = true;

                $http({
                    method: "POST",
                    url: server_nodeurl + "/testsikerBE/login",
                    params: {
                        password: $scope.login.password,
                        username: $scope.login.email
                    }
                }).success(function(data) {
                    $scope.loginInProgress = false;

                    console.log("reg válasz:" + data);
                    if (data === 'nemok') {
                        $scope.login.error = "Invalid username or password";
                    } else {
                        $('#loginAblak').modal('hide');
                        $rootScope.currentUser = data;
                        $rootScope.$broadcast("user_ok", {
                            currentUser: data
                        });
                    }
                });

            };


            $scope.loginFBUser = function() {
                console.log("loginFBUser");
                $scope.loginInProgress = true;

                $http({
                    method: "GET",
                    url: server_nodeurl + "/testsikerBE/fblogin",
                    params: {
                    }
                }).success(function(data) {
                    $scope.loginInProgress = false;

                    console.log("reg válasz:" + data);
                    if (data === 'nemok') {
                        $scope.login.error = "FB login nem OK";
                    } else {
                        $('#loginAblak').modal('hide');
                        $rootScope.currentUser = data;
                        $rootScope.$broadcast("user_ok", {
                            currentUser: data
                        });
                    }
                });

            };

            $scope.registerUser = function() {

                $http({
                    method: "POST",
                    url: server_nodeurl + "/testsikerBE/register",
                    params: {
                        username: $scope.newuser.alias,
                        password: $scope.newuser.password,
                        useremail: $scope.newuser.email
                    }
                }).success(function(data) {
                    console.log("reg válasz:" + data);
                    if (data === 'nemok') {
                        $scope.newuser.error = "Invalid username or password";
                    } else {
                        $scope.newuser.error = "User created!";
                    }
                });


            };


        },
        link: function(scope, elem, attr) {

        },
        replace: true,
        templateUrl: 'js/template/login.html'
    };
});


