const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

//O ideal seria salvar todas as conexões dentro um BD, mas a nivel de teste estou salvando dentro da memória do node
const connections = [];

let io;

//forma mais rápida de exportar um fução(sem declarar)
exports.setupWebsocket = (server) => { /** função recebe servidor como parâmetro  */
  // console.log('ok!!')

  io = socketio(server); /**declaro um variável io passando um servidor como parâmetro */

  //Toda vez que um usuário conectar na minha aplicação via protocolo websocket, eu recebo um obj chamado socket
  io.on('connection', socket => { /** estou adcionando um eventListener (ouvindo um evento) */

    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude), // Converto em number, pois a latitude e longitude vem no formati de String
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });

    // console.log(socket.id)
    // console.log(socket.handshake.query) /** para visualizar os paramtros envio pelo frontend */

    // /** Agora o backend envia informação para o frontend devido  sem o front fazer nenhum tipo de requisição, devido ao uso do websocket*/
    // setTimeout(() => {
    //   socket.emit('message', 'Hello OmniStack');
    // }, 3000);

  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {

    /**comparo as coordenadas do novo dev 
     * com as coordenadas armazenadas de cada uma das conexões com websocket */
    return calculateDistance(coordinates, connection.coordinates) < 10

      /**some = pelo menos uma condição verdadeira / includes se esta dentro ou possui */
      && connection.techs.some(item => techs.includes(item))
  })
}

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
}