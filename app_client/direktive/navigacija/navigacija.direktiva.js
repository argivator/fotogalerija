(function() {
    /* global angular */
    
    var navigacija = function() {
      return {
        restrict: 'EA',
        templateUrl: '/direktive/navigacija/navigacija.predloga.html',
        controller: 'navigacijaCtrl',
        controllerAs: 'navvm'
      };
    };
    
    angular
      .module('fotogalerija')
      .directive('navigacija', navigacija);
  })();