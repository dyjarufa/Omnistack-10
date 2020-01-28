import socketio from 'socket.io-client';

const socket = socketio('http://192.168.43.208:3333', {
  autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {//callback function
  socket.on('new-dev', subscribeFunction) /**houve evento 'new-dev' que vem lá do back e dispara a função*/
}

function connect(latitude, longitude, techs) {
  socket.io.opts.query = { /**envio esses parâmetros para o meu back */
    latitude,
    longitude,
    techs
  }

  socket.connect();

  // socket.on('message', text => { /** Logo após me conectar recebo uma mensagem lá do back */
  //   console.log(text);
  // })
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewDevs
}