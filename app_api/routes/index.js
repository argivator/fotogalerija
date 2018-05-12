var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var avtentikacija = jwt({
  secret: process.env.JWT_GESLO,
  userProperty: 'payload'
});

var ctrlUporabniki = require('../controllers/uporabniki');
var ctrlGalerije = require('../controllers/galerije');
var ctrlSlike = require('../controllers/slike');

//Galerije
router.get('/galerys/:email', ctrlGalerije.pridobiGalerije);
router.get('/galery/:idGalerije', ctrlGalerije.pridobiGalerijo);
router.post('/galery', ctrlGalerije.ustvariGalerijo);
router.delete('/galery/:idGalerije', ctrlGalerije.izbrisiGalerijo);

//Slike
router.post('/slika/:idGalerije/:imeSlike', ctrlSlike.naloziSliko);
router.delete('/slika/:idGalerije/:idSlike', ctrlSlike.izbrisiSliko);

// Uporabniki
router.post('/registracija', ctrlUporabniki.registracija);
router.post('/prijava', ctrlUporabniki.prijava);

module.exports = router;