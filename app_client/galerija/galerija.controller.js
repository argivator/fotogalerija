(function() {
    /* global angular */
    function galerijaCtrl($routeParams, $location, fotogalerijaData, avtentikacija, $scope, $compile) {
        var vm = this;

        var idGalerije = $routeParams.galleryID;

        vm.compare = false;
        var current =  document.querySelector("#current");
        const opacity = 0.6;
        
        var images = ["../images/3.jpg", "../images/5.jpg"]
        
        // testing stuff
        //var body =  document.getElementById("bodyId");
        // body.style.backgroundImage = "url(" + images[0] + ")";
        
        /*
        var i = 0;
        setInterval(function() {
              console.log("Change.");
              body.style.backgroundImage = "url(" + images[i] + ")";
              i = i + 1;
              if (i == images.length) {
                i =  0;
              }
        }, 2000);
        */
        
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
                    rm.innerHTML = "X";
                    
                    var add2nd = document.createElement("button");
                    add2nd.setAttribute("class", "btn btn-secondary cmpr");
                    add2nd.setAttribute("idSlike", odgovor.data.slike[i]._id);
                    add2nd.setAttribute("ng-disabled", "!vm.compare");
                    add2nd.innerHTML = "Primerjaj";
                    
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
                    //girestRowContainer.appendChild(add2nd);
                    
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
            
        current =  document.querySelector("#current");
        
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
                var files = document.getElementById('inputFile').files
                for (var i=0; i<files.length; i++) {
                    var f = files[i];
                    var fd = new FormData();
                    fd.append('slika', f);
                    startLoading();
                    fotogalerijaData.uploadImage(fd, idGalerije, f.name).then(
                        function success(odgovor) {
                            var imgContainer = document.createElement("div");
                            imgContainer.setAttribute("class", "imgContainer");
                            imgContainer.setAttribute("id", odgovor.data._id);
                            
                            
                            var imgName = document.createElement("span");
                            imgName.innerHTML = odgovor.data.ime_slike;
                            
                            var rm = document.createElement("button");
                            rm.setAttribute("class", "btn btn-secondary rm");
                            rm.setAttribute("idSlike", odgovor.data._id);
                            rm.innerHTML = "X";
                            
                            var add2nd = document.createElement("button");
                            add2nd.setAttribute("class", "btn btn-secondary cmpr");
                            add2nd.setAttribute("idSlike", odgovor.data._id);
                            add2nd.setAttribute("ng-disabled", "!vm.compare");
                            add2nd.innerHTML = "Primerjaj";
                            
                            var img = document.createElement("img");
                            img.setAttribute("src", "data:image/JPEG;base64," + _arrayBufferToBase64(odgovor.data.img.data));
                            img.addEventListener("click", imgClick);
                            
                            var imageRowContainer = document.createElement("div");
                            imageRowContainer.setAttribute("class", "imageRow");
                            
                            var restRowContainer = document.createElement("div");
                            restRowContainer.setAttribute("class", "restRow");
                            
                            imgContainer.appendChild(imageRowContainer);
                            imageRowContainer.appendChild(img);
                            imgContainer.appendChild(restRowContainer);
                            restRowContainer.appendChild(imgName);
                            
                            if (vm.avtorIsLogedIn)
                                restRowContainer.appendChild(rm);
                            //girestRowContainer.appendChild(add2nd);
                            
                            document.getElementsByClassName("imgs")[0].appendChild(imgContainer);
                            stopLoading();
                        }
                    );

                }
            }
            vm.openMenu1();
            
        }
        var open = false;
        vm.openMenu1 = function(){
            //console.log("Ok!");
            $('#menu1').toggleClass('show');
            //document.getElementById("menu1").toggleClass('open');
        }
        
        vm.odpriNavbar = function(){
            if(open){
                open = false;
                $('#navNapis').html("Pokaži orodno vrstico");
            }else{
                open = true;
                $('#navNapis').html("Skrij orodno vrstico");
            }
        }
        
        
        vm.toggleCompare = function(){
            if(vm.compare == false){
                vm.compare = true;
                document.getElementById("current").classList.add("glow");
                document.getElementById("11gridDiv").classList.remove('col-md-12');
                document.getElementById("11gridDiv").classList.add('col-md-6');
                
                $("#buttonCompare").html("Izklopi primerjanje");
                
                
            }else{
                vm.compare = false;
                document.getElementById("current").classList.remove("glow");
                document.getElementById("11gridDiv").classList.remove('col-md-6');
                document.getElementById("11gridDiv").classList.add('col-md-12');
                
                $("#buttonCompare").html("Vklopi primerjanje");
            }
        }
        
        vm.skrito = false;
        vm.pospraviSlikce = function(){
            if(!vm.skrito){
                // prikazi
                vm.skrito = true;
                setTimeout(function(){
                    document.getElementById("glavnaSlikca").classList.remove("col-md-9");
                document.getElementById("glavnaSlikca").classList.add("col-md-12");
                }, 350);
                
                
                
                
                
            }else{
                // skrij
                vm.skrito = false;
                setTimeout(function(){
                     document.getElementById("glavnaSlikca").classList.remove("col-md-12");
                    document.getElementById("glavnaSlikca").classList.add("col-md-9");
                }, 10)
               
                
                
                
            }
        }
        vm.stVrstic = 1;
        
        vm.dodajVrsticoCompare = function(){
            vm.stVrstic++;
            
            //var div = document.getElementById("compareDiv");
            var divTmp = $("#compareDiv");
            if(vm.compare){
                var gridNum1 = vm.stVrstic + "1grid";
                var gridNum2 = vm.stVrstic + "2grid";
                var toAdd = "<div class='novaVrstica row' ng-show='vm.compare'><div class='col-md-6 slikeGridItem' id='" + gridNum1 +"Div' ng-click='izberiTaKvadrat(\"" + gridNum1 + "\")'> \
                                         <img src='../images/placeholder.png' style='width: 80%'></div>     \
                            <div class='col-md-6 slikeGridItem' id='" + vm.stVrstic +"2gridDiv' ng-click='izberiTaKvadrat(\"" + gridNum2 + "\")')'><img src='../images/placeholder.png' style='width: 80%'></div></div>";
                divTmp.append($compile(toAdd)($scope));
                $scope.$apply();
            }
        }
        
        vm.izberiTaKvadrat = function(idSlike){
            console.log(idSlike);
            var divId = idSlike +  "Div";
            var div = $("#" + divId);
            //div.css("background-color", "white");
            document.getElementById("current").classList.remove("glow");
            $("#current").attr("id","temp");
            div.find('img').attr("id", "current");
            document.getElementById("current").classList.add("glow");
        }
        
        vm.odstraniVrsticoCompare = function(){
            vm.stVrstic--;
            
            var divTmp = $("#compareDiv");
            $('#compareDiv div.novaVrstica').last().remove();
            
        }
        
        $scope.izberiTaKvadrat = function(idSlike){
            console.log(idSlike);
            
            var divId = idSlike +  "Div";
            var div = $("#" + divId);
            //div.css("background-color", "white");
            document.getElementById("current").classList.remove("glow");
            $("#current").attr("id","temp");
            div.find('img').attr("id", "current");
            document.getElementById("current").classList.add("glow");
        }
        
        
        
        //LOADING FUNCTIONS
        
        function startLoading() {
    		$(".loading").show();
    	}
    	
    	function stopLoading() {
    		$(".loading").hide();
    	}
        

    }

    galerijaCtrl.$inject = ['$routeParams', '$location', 'fotogalerijaData', 'avtentikacija', '$scope', '$compile'];

    angular
        .module('fotogalerija')
        .controller('galerijaCtrl', galerijaCtrl);

})();
