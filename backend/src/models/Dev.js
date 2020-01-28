const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

/** Schema é a estruturação de uma entidade dentro de um BD*/
const DevSchema = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String], /** aqui será um vetor de várias strings */
    location: {
        type: PointSchema,
        index: '2dsphere' //precisamos criar um índice, pois facilita a busca - Aqui será a Latitude e Longitude
    }
});

/** 1º parametro é o nome que será salvo no BD (Dev) e o 2º é o meu schema*/
module.exports = mongoose.model('Dev', DevSchema); 