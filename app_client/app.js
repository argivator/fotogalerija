(function() {
    /* global angular */
    angular.module('fotogalerija', ['ngRoute']);

    routes.$inject = ["$routeProvider", "$locationProvider"];

    function routes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: "/dashboard/dashboard.view.html",
                controller: "dashboardCtrl",
                controllerAs: "vm"
            })
            .when('/prijava', {
                templateUrl: "/uporabniki/prijava/prijava.view.html",
                controller: "prijavaCtrl",
                controllerAs: "vm"
            })
            .when('/registracija', {
                templateUrl: "/uporabniki/registracija/registracija.view.html",
                controller: "registracijaCtrl",
                controllerAs: "vm"
            })
            .when('/:galleryID', {
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
