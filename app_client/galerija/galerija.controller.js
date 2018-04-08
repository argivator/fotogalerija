(function() {
    /* global angular */
    function galerijaCtrl($routeParams, $location, fotogalerijaData) {
        var vm = this;

        vm.images = [];

        const current = document.querySelector("#current");
        const opacity = 0.6;
        
        
        fotogalerijaData.getGalery("5ac8975b1274f014dec92d63").then(
            function success(odgovor) {
                
                //dodaj prvo sliko za "current"
                $("#current").attr("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.slike[0].img.data));
                
                //nalozi vse slike
                for (var i=0; i<odgovor.data.slike.length; i++) {
                    
                    console.log(odgovor.data.slike[i]._id);
                    var img = document.createElement("img");
                    img.setAttribute("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.slike[i].img.data));
                    img.addEventListener("click", imgClick);
                    
                    if(i==0) {
                        img.style.opacity = opacity;
                    }
                    
                    document.getElementsByClassName("imgs")[0].appendChild(img);
                }
                
                
            },
            function error(napaka) {
                
            });
        

        
        
        
        function imgClick(e) {
            var imgs = document.getElementsByTagName("img");
            
            //Reset the opacity
            for (var i=1; i<imgs.length; i++) {
                imgs[i].style.opacity = 1;
            }
        
          // Change current image to src of clicked image
          current.src = e.target.src;
        
          // Add fade in class
          current.classList.add("fade-in");
        
          // Remove fade-in class after .5 seconds
          setTimeout(() => current.classList.remove("fade-in"), 500);
        
          // Change the opacity to opacity var
          e.target.style.opacity = opacity;
        }
        
        
        
        
        
        

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
    
    
    
        vm.upload = function() {
            if (document.getElementById('inputFile').files.length > 0) {
                var f = document.getElementById('inputFile').files[0];

                fotogalerijaData.uploadImage(f, "5ac8975b1274f014dec92d63", "slika1");
                
            }
            
        }
        

    }

    galerijaCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData'];

    angular
        .module('fotogalerija')
        .controller('galerijaCtrl', galerijaCtrl);

})();
