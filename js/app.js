var animateApp = angular.module('animateApp', []);

animateApp.controller('basicController', function($scope, $rootScope, $http) {

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

});



