const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
    type: {
        type: String, //aqui é uma coluna
        enum: ['Point'], //preciso informar que é um point. É obrigatório
        required: true
    },
    coordinates: {
        type: [Number], //precisa ser um array de numero, devido a latitude e longitude
        required: true
    },
});

module.exports = PointSchema;