(function() {
    /* global angular */
    
    navigacijaCtrl.$inject = ['$location', 'avtentikacija', '$route'];
    function navigacijaCtrl($location, avtentikacija, $route) {
      var navvm = this;
      
      navvm.trenutnaLokacija = $location.path();
      
      navvm.jePrijavljen = avtentikacija.jePrijavljen();
      
      navvm.trenutniUporabnik = avtentikacija.trenutniUporabnik();
      
      navvm.odjava = function() {
        avtentikacija.odjava();
        $location.path('/prijava');
        $route.reload();
      }
    };
    
    angular
      .module('fotogalerija')
      .controller('navigacijaCtrl', navigacijaCtrl);
  })();