var mongoose = require('mongoose');

var slikeShema = new mongoose.Schema({
    ime_slike: {type: String, required: true},
    img: { type: Buffer, required: true},
    img_type: {type: String, required: true}
});

var galerijeShema = new mongoose.Schema({
    avtor_email: {type: String, required: true},
    ime_galerije: {type: String, required: true},
    slike: [slikeShema]
});
  


mongoose.model('Galerija', galerijeShema, 'Galerije');