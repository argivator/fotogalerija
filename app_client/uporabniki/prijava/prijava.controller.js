(function() {
    /* global angular */
    
    prijavaCtrl.$inject = ['$location', 'avtentikacija'];
    function prijavaCtrl($location, avtentikacija) {
      var vm = this;

      
      vm.prijavniPodatki = {
        elektronskiNaslov: "",
        geslo: ""
      };
      
      vm.posiljanjePodatkov = function() {
        vm.napakaNaObrazcu = "";
        if (!vm.prijavniPodatki.elektronskiNaslov || !vm.prijavniPodatki.geslo) {
          vm.napakaNaObrazcu = "Zahtevani so vsi podatki, prosim poskusite znova!";
          return false;
        } else {
          vm.izvediPrijavo();
        }
      };
      
      vm.izvediPrijavo = function() {
        vm.napakaNaObrazcu = "";
        avtentikacija
          .prijava(vm.prijavniPodatki)
          .then(function success() {
            $location.path('/');
          }, function error(napaka) {
            vm.napakaNaObrazcu = napaka.data.sporocilo;
          });
      };
    }
    
    angular
      .module('fotogalerija')
      .controller('prijavaCtrl', prijavaCtrl);
  })();