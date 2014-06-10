animateApp.controller('mainController', function($scope,$rootScope) {
    
    console.log("dashboardController, innen jövök:"+$rootScope.aktOldal);
    $scope.pageClass = 'page-home';
    $rootScope.aktOldal = 'dashboard';
    
//    $rootScope.pageClassFai = 'page-home';
//    $rootScope.aktOldal = 'dashboard';
});