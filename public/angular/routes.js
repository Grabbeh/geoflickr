app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: '/partials/main.html',
            controller: 'mainController'
        }).
        when('/login', {
            templateUrl: '/partials/privacy.html'
        }).
        otherwise({
            redirectTo: '/'
    });
}]);