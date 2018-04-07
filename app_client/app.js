(function() {
    /* global angular */
    angular.module('fotogalerija', ['ngRoute']);

    routes.$inject = ["$routeProvider", "$locationProvider"];

    function routes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "/galerija/galerija.view.html",
                controller: "galerijaCtrl",
                controllerAs: "vm"
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
    }

    angular
        .module('fotogalerija')
        .config(['$routeProvider', '$locationProvider', routes]);
})();
