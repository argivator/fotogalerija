(function() {
  /* global angular */
  
  var fotogalerijaData = function($http) {
      
    var uploadImage = function(data, idGalerije, imeSlike) {
      var fd = new FormData();
      fd.append('slika', data);
      
      $(".loading").show();
      
      $http.post('/api/slika/' + idGalerije +"/"+imeSlike, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      }).then(
        function() {
            location.reload();
        });
    };
    
    var getGalery = function(idGalerije) {
        return $http.get('/api/galery/' + idGalerije);
    };

    var getGalerys = function(email) {
      return $http.get('/api/galerys/' + email);
    };
    
    var removeImage = function(idGalerije, idSlike) {
      $(".loading").show();
      $http.delete('api/slika/' + idGalerije + '/' + idSlike).then(
        function(odgovor) {
          $(".loading").hide();
          return odgovor;
        })
    }
    
    
    return {
      uploadImage: uploadImage,
      getGalery: getGalery,
      getGalerys: getGalerys,
      removeImage: removeImage
    };
  };
  fotogalerijaData.$inject = ['$http'];
  
  angular
    .module('fotogalerija')
    .service('fotogalerijaData', fotogalerijaData);
})();