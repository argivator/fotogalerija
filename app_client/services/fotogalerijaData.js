(function() {
  /* global angular */
  
  var fotogalerijaData = function($http) {
      
    var uploadImage = function(data, idGalerije, imeSlike) {
      var fd = new FormData();
      fd.append('slika', data);
      
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
    }
    
    
    return {
      uploadImage: uploadImage,
      getGalery: getGalery
    };
  };
  fotogalerijaData.$inject = ['$http'];
  
  angular
    .module('fotogalerija')
    .service('fotogalerijaData', fotogalerijaData);
})();