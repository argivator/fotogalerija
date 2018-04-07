var passport = require('passport');
var mongoose = require('mongoose');
var Uporabnik = mongoose.model('Uporabnik');

var vrniJsonOdgovor = function(odgovor, status, vsebina) {
  odgovor.status(status);
  odgovor.json(vsebina);
};

module.exports.registracija = function(zahteva, odgovor) {
  if (!zahteva.body.ime || !zahteva.body.elektronskiNaslov || !zahteva.body.geslo) {
    vrniJsonOdgovor(odgovor, 400, {"sporočilo": "Zahtevani so vsi podatki"});
    return;
  }
  
  var uporabnik = new Uporabnik();
  uporabnik.ime = zahteva.body.ime;
  uporabnik.elektronskiNaslov = zahteva.body.elektronskiNaslov;
  uporabnik.nastaviGeslo(zahteva.body.geslo);
  uporabnik.save(function(napaka) {
    var zeton;
    if (napaka) {
      vrniJsonOdgovor(odgovor, 404, napaka);
    } else {
      zeton = uporabnik.generirajJwt();
      vrniJsonOdgovor(odgovor, 200, {
        "zeton": zeton
      });
    }
  });
};

module.exports.prijava = function(zahteva, odgovor) {
  if (!zahteva.body.elektronskiNaslov || !zahteva.body.geslo) {
    vrniJsonOdgovor(odgovor, 400, {
      "sporocilo": "Zahtevani so vsi podatki"
    });
  }
  
  passport.authenticate('local', function(napaka, uporabnik, podatki) {
    var zeton;
    if (napaka) {
      vrniJsonOdgovor(odgovor, 404, napaka);
      return;
    }
    if (uporabnik) {
      zeton = uporabnik.generirajJwt();
      vrniJsonOdgovor(odgovor, 200, {
        "zeton": zeton
      });
    } else {
      vrniJsonOdgovor(odgovor, 401, podatki);
    }
  })(zahteva, odgovor);
};