const mongoose = require('mongoose');

const MotoSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  ano: {
    type: Number,
    required: true
  },
  cilindrada: {
    type: Number,
    required: true
  },
  preco: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Moto', MotoSchema);
