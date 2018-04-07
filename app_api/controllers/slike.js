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
    console.log(req.files.slika);
    
    galerija.slike.push({
        ime_slike: req.params.imeSlike,
        img: file.data,
        img_type: file.mimetype
    });
    galerija.save(function(napaka, lokacija) {
      if (napaka) {
        vrniJsonOdgovor(res, 400, napaka);
      } else {
        vrniJsonOdgovor(res, 201, null);
      }
    });

};
