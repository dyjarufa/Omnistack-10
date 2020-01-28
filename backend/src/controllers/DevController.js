const axios = require('axios'); //biblioteca responsável para realizar chamada apara outras APIs
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

const { findConnections, sendMessage } = require('../websocket')

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            //name é a informação padrão - caso o name  não exista, eu pego o login
            const { name = login, avatar_url, bio } = apiResponse.data;

            // const techArray = techs.split(',').map(tech => tech.trim());
            const techArray = parseStringAsArray(techs);

            /**Objeto criado de acordo com o PointSchema */
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude], //Mongo db segue sempre a ordem, Longitude e latitude
            };

            //conceito de Short Syntax
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techArray,
                location,
            });

            //Filtrar as conexões que estão ha no máximo de 10km de 
            //distância e que o novo dev possua pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        return response.json(dev);
    },
};