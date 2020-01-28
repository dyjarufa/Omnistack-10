const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        //buscar todos devs num raio de 10km
        //filtrar por tecnologias
        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray, // $in esta na documentação do mongo db
            },
            location: {
                $near: { //o $near consegue encontrar objs dentro de uma localização
                    $geometry: { //geometry segue os parãmetros que defini em PointSchema
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        response.json({ devs });
    }
}