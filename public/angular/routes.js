app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: '/partials/main.html',
            controller: 'mainController'
        }).
        when('/privacy', {
            templateUrl: '/partials/privacy.html'
        }).
        otherwise({
            redirectTo: '/'
    });
}]);