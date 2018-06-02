(function() {
  /* global angular */
  
  var fotogalerijaData = function($http) {
      
    var uploadImage = function(fd, idGalerije, imeSlike) {
      return $http.post('/api/slika/' + idGalerije +"/"+imeSlike, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      });
    };
    
    var getGalery = function(idGalerije) {
        return $http.get('/api/galery/' + idGalerije);
    };

    var getGalerys = function(email) {
      return $http.get('/api/galerys/' + email);
    };

    var dodajGalerijo = function(data) {
      return $http.post('/api/galery', data);
    };

    var deleteGalery = function(idGalerije) {
      return $http.delete('/api/galery/' + idGalerije);
    }
    
    var removeImage = function(idGalerije, idSlike) {
      $(".loading").show();
      $http.delete('api/slika/' + idGalerije + '/' + idSlike).then(
        function(odgovor) {
          $(".loading").hide();
          return odgovor;
        })
    };
    
    
    return {
      uploadImage: uploadImage,
      getGalery: getGalery,
      getGalerys: getGalerys,
      dodajGalerijo: dodajGalerijo,
      deleteGalery: deleteGalery,
      removeImage: removeImage
    };
  };
  fotogalerijaData.$inject = ['$http'];
  
  angular
    .module('fotogalerija')
    .service('fotogalerijaData', fotogalerijaData);
})();