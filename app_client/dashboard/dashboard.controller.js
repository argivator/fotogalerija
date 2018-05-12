(function() {
    /* global angular */
    function dashboardCtrl($routeParams, $location, fotogalerijaData, avtentikacija) {
        var vm = this;

        if (!avtentikacija.jePrijavljen()) {
            $location.path("/prijava");
        }
        var currUserEmail = avtentikacija.trenutniUporabnik().elektronskiNaslov;

        fotogalerijaData.getGalerys(currUserEmail).then(
            function success(odgovor) {
                console.log(odgovor);
            }, function error(napaka) {
                console.log("Napaka pri pridobivanju galerij uporabnika!");
            }
        );


    }

    dashboardCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData', 'avtentikacija'];

    angular
        .module('fotogalerija')
        .controller('dashboardCtrl', dashboardCtrl);

})();
