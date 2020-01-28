const { Router } = require('express'); //importei o módulo de roteamente do express

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.get('/search', SearchController.index);

module.exports = routes; //Estou exportando o obj routes 