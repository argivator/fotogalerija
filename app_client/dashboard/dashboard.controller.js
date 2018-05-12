(function() {
    /* global angular */
    function dashboardCtrl($routeParams, $location, fotogalerijaData, avtentikacija, $scope) {
        var vm = this;

        if (!avtentikacija.jePrijavljen()) {
            $location.path("/prijava");
        }
        var currUserEmail = avtentikacija.trenutniUporabnik().elektronskiNaslov;

        fotogalerijaData.getGalerys(currUserEmail).then(
            function success(odgovor) {
                vm.galerije = odgovor.data;
            }, function error(napaka) {
                console.log("Napaka pri pridobivanju galerij uporabnika!");
            }
        );

        
        // DODAJANJE GALERIJE
        $('#add').on('click', '.btn-success', function(e) {
            vm.formError = "";
            $scope.$apply();
            var $modalDiv = $(e.delegateTarget);
            if (dodajGalerijo()) {
                $modalDiv.modal('hide');
                vm.dodajanjeGalerije = {};
            }
        });

        function dodajGalerijo() {
            if (!vm.dodajanjeGalerije || !vm.dodajanjeGalerije.ime_galerije) {
                vm.formError = "Prosim vnesite ime galerije!";
                $scope.$apply();
                return false;
            }

            vm.dodajanjeGalerije.elektronskiNaslov = currUserEmail;
            
            fotogalerijaData.dodajGalerijo(vm.dodajanjeGalerije).then(
                function success(odgovor) {
                    vm.galerije.push(odgovor.data);
                });
            return true;
        }
        
        

        // DODAJANJE GALERIJE
        $('#delete').on('show.bs.modal', function(e) {
            var idGalerije = $(e.relatedTarget).attr('data-href');
            $('.btn-success', this).data('idGalerije', idGalerije);
        });

        $('#delete').on('click', '.btn-success', function(e) {
            var $modalDiv = $(e.delegateTarget);
            var idGalerije = $(this).data('idGalerije');
            izbrisiGalerijo(idGalerije);
            $modalDiv.modal('hide');
        });

        function izbrisiGalerijo(idGalerije) {
            fotogalerijaData.deleteGalery(idGalerije).then(
                function success(odgovor) {
                    fotogalerijaData.getGalerys(currUserEmail).then(
                        function success(odgovor) {
                            vm.galerije = odgovor.data;
                        }, function error(napaka) {
                            console.log("Napaka pri pridobivanju galerij uporabnika!");
                        });
                });

            
        }
    }

    dashboardCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData', 'avtentikacija', '$scope'];

    angular
        .module('fotogalerija')
        .controller('dashboardCtrl', dashboardCtrl);

})();
