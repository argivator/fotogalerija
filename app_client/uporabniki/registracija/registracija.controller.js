(function() {
    /* global angular */
    
    registracijaCtrl.$inject = ['$location', 'avtentikacija'];
    function registracijaCtrl($location, avtentikacija) {
      var vm = this;
            
      vm.prijavniPodatki = {
        ime: "",
        elektronskiNaslov: "",
        geslo: ""
      };
      
      vm.posiljanjePodatkov = function() {
        vm.napakaNaObrazcu = "";
        if (!vm.prijavniPodatki.ime || !vm.prijavniPodatki.elektronskiNaslov || !vm.prijavniPodatki.geslo) {
          vm.napakaNaObrazcu = "Zahtevani so vsi podatki, prosim poskusite znova!";
          return false;
        } else {
          vm.izvediRegistracijo();
        }
      };
      
      vm.izvediRegistracijo = function() {
        vm.napakaNaObrazcu = "";
        avtentikacija
          .registracija(vm.prijavniPodatki)
          .then(function success() {
            $location.path('/');
          }, function error(napaka) {
            console.log(napaka);
            vm.napakaNaObrazcu = napaka.data.sporocilo;
          });
      };
    }
    
    angular
      .module('fotogalerija')
      .controller('registracijaCtrl', registracijaCtrl);
  })();