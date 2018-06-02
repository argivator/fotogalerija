var mongoose = require('mongoose');
var Galerija = mongoose.model('Galerija');



var vrniJsonOdgovor = function(odgovor, status, vsebina) {
  odgovor.status(status);
  odgovor.json(vsebina);
};


module.exports.naloziSliko = function(req, res) {
    if (req.params.idGalerije && req.params.imeSlike) {
        Galerija
            .findById(req.params.idGalerije)
            .select('slike')
            .exec(
                function(err, galerija) {
                    if (err)
                        vrniJsonOdgovor(res, 400, err);
                    else
                        dodajSliko(req, res, galerija)
                });
    } else {
        vrniJsonOdgovor(res, 404, { "sporočilo": 
      "Manjka identifikator idGalerije"});
    }
};

var dodajSliko = function(req, res, galerija) {
    var file = req.files.slika;
    
    galerija.slike.push({
        ime_slike: req.params.imeSlike,
        img: file.data,
        img_type: file.mimetype
    });
    galerija.save(function(napaka, slika) {
      if (napaka) {
        vrniJsonOdgovor(res, 400, napaka);
      } else {
        vrniJsonOdgovor(res, 201, slika.slike[slika.slike.length-1]);
      }
    });

};


module.exports.izbrisiSliko = function(req, res) {
    if (!req.params.idGalerije || !req.params.idSlike) {
        vrniJsonOdgovor(res, 404, {"spročilo": "Manjkajo parametri."});
        return;
    }
    Galerija
        .findById(req.params.idGalerije)
        .exec(
            function(err, galerija) {
                if (!galerija) {
                  vrniJsonOdgovor(res, 404, {"sporočilo": "Galerije ne najdem."});
                  return;
                } else if (err) {
                  vrniJsonOdgovor(res, 404, err);
                  return;
                }
                if (galerija.slike && galerija.slike.length > 0) {
                  if (!galerija.slike.id(req.params.idSlike)) {
                    vrniJsonOdgovor(res, 404, {"sporočilo": "Slike ne najdem."});
                  } else {
                    galerija.slike.id(req.params.idSlike).remove();
                    galerija.save(function(err) {
                      if (err) {
                        vrniJsonOdgovor(res, 404, err);
                      } else {
                        vrniJsonOdgovor(res,  204, null);
                      }
                    });
                  }
                } else {
                  vrniJsonOdgovor(res, 404, {"sporočilo": "Ni slike za brisanje."});
                }
            });
    
};