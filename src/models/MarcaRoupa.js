const mongoose = require('mongoose');

const MarcaRoupaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  fundador: {
    type: String,
    required: true
  },
  anoFundacao: {
    type: Number,
    required: true
  },
  paisOrigem: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MarcaRoupa', MarcaRoupaSchema);
