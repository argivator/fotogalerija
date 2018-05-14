(function() {
    /* global angular */
    function galerijaCtrl($routeParams, $location, fotogalerijaData, avtentikacija) {
        var vm = this;

        var idGalerije = $routeParams.galleryID;


        const current = document.querySelector("#current");
        const opacity = 0.6;
        
        
        // nalozi vse slike iz baze in prvo(če obstaja) nastavi za glavno
        startLoading();
        fotogalerijaData.getGalery(idGalerije).then(
            function success(odgovor) {

                if (!avtentikacija.jePrijavljen()) {
                    vm.avtorIsLogedIn = false;
                } else {
                    vm.avtorIsLogedIn = (avtentikacija.trenutniUporabnik().elektronskiNaslov == odgovor.data.avtor_email);
                }
                
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
                    rm.setAttribute("class", "btn btn-secondary rm");
                    rm.setAttribute("idSlike", odgovor.data.slike[i]._id);
                    rm.innerHTML = "Delete";
                    
                    var img = document.createElement("img");
                    img.setAttribute("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.slike[i].img.data));
                    img.addEventListener("click", imgClick);
                    
                    var imageRowContainer = document.createElement("div");
                    imageRowContainer.setAttribute("class", "imageRow");
                    
                    var restRowContainer = document.createElement("div");
                    restRowContainer.setAttribute("class", "restRow");
                    
                    if(i==0) {
                        img.style.opacity = opacity;
                    }
                    
                    imgContainer.appendChild(imageRowContainer);
                    imageRowContainer.appendChild(img);
                    imgContainer.appendChild(restRowContainer);
                    restRowContainer.appendChild(imgName);
                    if (vm.avtorIsLogedIn)
                        restRowContainer.appendChild(rm);
                    
                    document.getElementsByClassName("imgs")[0].appendChild(imgContainer);
                }
                stopLoading();
                
            },
            function error(napaka) {
                console.log("Galerija not found!");
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
            for (var i=0; i<imgs.length; i++) {
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
            if (document.getElementById('inputFile').files.length > 0 && vm.imeSlike) {
                var f = document.getElementById('inputFile').files[0];

                fotogalerijaData.uploadImage(f, idGalerije, vm.imeSlike);
            }
            vm.openMenu1();
            
        }
        var open = false;
        vm.openMenu1 = function(){
            console.log("Ok!");
            if(open){
                open = false;
                $('#navNapis').html("Pokaži orodno vrstico");
            }else{
                open = true;
                $('#navNapis').html("Skrij orodno vrstico");
            }
            $('#menu1').toggleClass('show');
            //document.getElementById("menu1").toggleClass('open');
        }
        
        
        
        
        
        
        //LOADING FUNCTIONS
        
        function startLoading() {
    		$(".loading").show();
    	}
    	
    	function stopLoading() {
    		$(".loading").hide();
    	}
        

    }

    galerijaCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData', 'avtentikacija'];

    angular
        .module('fotogalerija')
        .controller('galerijaCtrl', galerijaCtrl);

})();
