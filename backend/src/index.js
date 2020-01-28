const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const http = require('http'); //Agora aplicação irá ouvir tanto as requisições http quando websocket
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app); //Agora o meu servidor http esta fora do express

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-vvedb.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors()) //libera acesso externo para todo tipo de aplicação
//express não entende formato json, por isso preciso cadastrar o express para entender requisições no formato json
app.use(express.json());
app.use(routes); //indico que estou usando minhas rotas


//app.listen(3333);
server.listen(3333);
