(function () {
    /* global angular */
    
    avtentikacija.$inject = ['$window', '$http'];
    function avtentikacija($window, $http) {
      var b64Utf8 = function (niz) {
        return decodeURIComponent(Array.prototype.map.call($window.atob(niz), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''));
      };
      var shraniZeton = function(zeton) {
        $window.localStorage['edugeocache-zeton'] = zeton;
      };
      var vrniZeton = function() {
        return $window.localStorage['edugeocache-zeton'];
      };
      var registracija = function(uporabnik) {
        return $http.post('/api/registracija', uporabnik).then(
          function success(odgovor) {
            shraniZeton(odgovor.data.zeton);
          });
      };
      var prijava = function(uporabnik) {
        return $http.post('/api/prijava', uporabnik).then(
          function success(odgovor) {
            shraniZeton(odgovor.data.zeton);
          });
      };
      var odjava = function() {
        $window.localStorage.removeItem('edugeocache-zeton');
      };
      var jePrijavljen = function() {
        var zeton = vrniZeton();
        if (zeton) {
          var koristnaVsebina = JSON.parse(b64Utf8(zeton.split('.')[1]));
          return koristnaVsebina.datumPoteka > Date.now() / 1000;
        } else {
          return false;
        }
      };
      var trenutniUporabnik = function() {
        if (jePrijavljen()) {
          var zeton = vrniZeton();
          var koristnaVsebina = JSON.parse(b64Utf8(zeton.split('.')[1]));
          return {
            elektronskiNaslov: koristnaVsebina.elektronskiNaslov,
            ime: koristnaVsebina.ime
          };
        }
      };
      return {
        shraniZeton: shraniZeton,
        vrniZeton: vrniZeton,
        registracija: registracija,
        prijava: prijava,
        odjava: odjava,
        jePrijavljen: jePrijavljen,
        trenutniUporabnik: trenutniUporabnik
      };
    }
    
    angular
      .module('fotogalerija')
      .service('avtentikacija', avtentikacija);
  })();