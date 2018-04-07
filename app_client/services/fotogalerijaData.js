(function() {
  /* global angular */
  
  var fotogalerijaData = function($http) {
      
    var uploadImage = function(data, idGalerije, imeSlike) {
      return $http.post('/api/slika/' + idGalerije +"/"+imeSlike, data, { headers: { 'Content-Type': undefined } });
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