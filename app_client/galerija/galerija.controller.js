(function() {
    /* global angular */
    function galerijaCtrl($routeParams, $location, fotogalerijaData) {
        var vm = this;

        vm.images = [];

        const current = document.querySelector("#current");
        const imgs = document.querySelectorAll("#imgs img");
        const opacity = 0.6;
        
        // Set first img opacity
        imgs[0].style.opacity = opacity;
        
        imgs.forEach(img => img.addEventListener("click", imgClick));
        
        function imgClick(e) {
          // Reset the opacity
          imgs.forEach(img => (img.style.opacity = 1));
        
          // Change current image to src of clicked image
          current.src = e.target.src;
        
          // Add fade in class
          current.classList.add("fade-in");
        
          // Remove fade-in class after .5 seconds
          setTimeout(() => current.classList.remove("fade-in"), 500);
        
          // Change the opacity to opacity var
          e.target.style.opacity = opacity;
        }
        
        
        fotogalerijaData.getGalery("5ac8975b1274f014dec92d63").then(
            function success(odgovor) {
                console.log(odgovor.data);
                //$("#current").attr("src", odgovor.data.slike[0].img);
                
                vm.image = _arrayBufferToBase64(odgovor.data.slike[0].img.data);
                vm.image2 = _arrayBufferToBase64(odgovor.data.slike[1].img.data);
            },
            function error(napaka) {
                
            });
        

        //slika pride iz DB v obliki "arrayBuffer" za prikaz potrebno pretvoriti v Base64
        function _arrayBufferToBase64( buffer ) {
          var binary = '';
          var bytes = new Uint8Array( buffer );
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
          }
          return window.btoa( binary );
        }
    
        

    }

    galerijaCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData'];

    angular
        .module('fotogalerija')
        .controller('galerijaCtrl', galerijaCtrl);

})();
