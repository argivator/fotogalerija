var mongoose = require('mongoose');
var Galerija = mongoose.model('Galerija');

var vrniJsonOdgovor = function(odgovor, status, vsebina) {
  odgovor.status(status);
  odgovor.json(vsebina);
};

module.exports.pridobiGalerijo = function(req, res) {
    if (req.params && req.params.idGalerije) {
        Galerija
            .findById(req.params.idGalerije)
            .exec(function(err, galerija) {
            if (!galerija) {
              vrniJsonOdgovor(res, 404, { "sporočilo": 
                "Ne najdem galerije s podanim identifikatorjem idGalerije." });
              return;
            } else if (err) {
              vrniJsonOdgovor(res, 404, err);
              return;
            }
            vrniJsonOdgovor(res, 200, galerija);
          });
    } else {
    vrniJsonOdgovor(res, 404, { "sporočilo": 
      "Manjka identifikator idGalerije"});
    }
    
};

module.exports.pridobiGalerije = function(req, res) {
	if (req.params && req.params.email) {
		Galerija
			.find({
				'avtor_email': req.params.email
      })
      .select({
        '_id': 1,
        'avtor_email': 1,
        'ime_galerije': 1
      })
			.exec(function(err, results) {
				if (err) {
					vrniJsonOdgovor(res, 404, err);
					return;
				}
				vrniJsonOdgovor(res, 200, results);
			});
	} else {
		vrniJsonOdgovor(res, 404, { "sporočilo": "Manjka email."})
	}
};


module.exports.ustvariGalerijo = function(req, res) {
    Galerija.create({
        avtor_email: req.body.elektronskiNaslov,    //req.payload
        ime_galerije: req.body.ime_galerije,
    }, function(err, galerija) {
    if (err)
      vrniJsonOdgovor(res, 400, err);
    else
      vrniJsonOdgovor(res, 201, galerija);
  });
};


module.exports.izbrisiGalerijo = function(req, res) {
    if (req.params.idGalerije) {
      Galerija
        .findByIdAndRemove(req.params.idGalerije)
        .exec(
           function(err) {
              if (err) {
                vrniJsonOdgovor(res, 404, err);
                return;
              }
              vrniJsonOdgovor(res, 204, null);
            } 
        );
    } else {
        vrniJsonOdgovor(res, 404, {"sporočilo": "Ne najdem galerije, idGalerije je obvezen parameter."});
    }
};