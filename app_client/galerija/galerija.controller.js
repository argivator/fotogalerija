(function() {
    /* global angular */
    function galerijaCtrl($routeParams, $location, fotogalerijaData) {
        var vm = this;

        var idGalerije = $routeParams.galleryID;    // id galerije dobi iz URL

        const current = document.querySelector("#current");
        const opacity = 0.6;
        
        
        // nalozi vse slike iz baze in prvo(če obstaja) nastavi za glavno
        startLoading();
        fotogalerijaData.getGalery(idGalerije).then(
            function success(odgovor) {
                
                vm.ime_galerije = odgovor.data.ime_galerije;
                
                //dodaj prvo sliko za "current"
                if (odgovor.data.slike.length > 0)
                    $("#current").attr("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.slike[0].img.data));
                
                //nalozi vse slike
                for (var i=0; i<odgovor.data.slike.length; i++) {
                    var imgContainer = document.createElement("div");
                    imgContainer.setAttribute("class", "imgContainer");
                    imgContainer.setAttribute("id", odgovor.data.slike[i]._id);
                    
                    
                    var imgName = document.createElement("span");
                    imgName.innerHTML = odgovor.data.slike[i].ime_slike;
                    
                    var rm = document.createElement("button");
                    rm.setAttribute("class", "btn btn-danger rm");
                    rm.setAttribute("idSlike", odgovor.data.slike[i]._id);
                    rm.innerHTML = "Delete";
                    
                    var img = document.createElement("img");
                    img.setAttribute("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.slike[i].img.data));
                    img.addEventListener("click", imgClick);
                    
                    if(i==0) {
                        img.style.opacity = opacity;
                    }
                    
                    
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(imgName);
                    imgContainer.appendChild(rm);
                    
                    document.getElementsByClassName("imgs")[0].appendChild(imgContainer);
                }
                stopLoading();
                
            },
            function error(napaka) {
                $("form").empty();
                vm.error = "404 galerija ne obstaja.";
            });
        
        
        // izbrise sliko
        $(document.body).on('click', '.rm', function(e) {
            var idSlike = e.currentTarget.getAttribute("idSlike");
            if (confirm("Želite izbrisati sliko?")) {
                fotogalerijaData.removeImage(idGalerije, idSlike);
                
                document.getElementsByClassName("imgs")[0].removeChild(document.getElementById(idSlike));
                

            }
        });
        
        
        // nastavi sliko za glavno
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
    
    
        //nalozi sliko v bazo
        vm.upload = function() {
            if (document.getElementById('inputFile').files.length > 0) {
                var f = document.getElementById('inputFile').files[0];

                fotogalerijaData.uploadImage(f, idGalerije, "slika1");
                
            }
            
        }
        
        
        
        
        
        
        //LOADING FUNCTIONS
        
        function startLoading() {
    		$(".loading").show();
    	}
    	
    	function stopLoading() {
    		$(".loading").hide();
    	}
        

    }

    galerijaCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData'];

    angular
        .module('fotogalerija')
        .controller('galerijaCtrl', galerijaCtrl);

})();
