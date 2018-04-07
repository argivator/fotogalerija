var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var uporabnikiShema = new mongoose.Schema({
  elektronskiNaslov: {type: String, unique: true, required: true},
  ime: {type: String, required: true},
  nakljucnaVrednost: String,
  zgoscenaVrednost: String
});

uporabnikiShema.methods.nastaviGeslo = function(geslo) {
  this.nakljucnaVrednost = crypto.randomBytes(16).toString('hex');
  this.zgoscenaVrednost = crypto.pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512').toString('hex');
};

uporabnikiShema.methods.preveriGeslo = function(geslo) {
  var zgoscenaVrednost = crypto.pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512').toString('hex');
  return this.zgoscenaVrednost == zgoscenaVrednost;
};

uporabnikiShema.methods.generirajJwt = function() {
  var datumPoteka = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);
  
  return jwt.sign({
    _id: this._id,
    elektronskiNaslov: this.elektronskiNaslov,
    ime: this.ime,
    datumPoteka: parseInt(datumPoteka.getTime() / 1000, 10)
  }, process.env.JWT_GESLO);
};

mongoose.model('Uporabnik', uporabnikiShema, 'Uporabniki');