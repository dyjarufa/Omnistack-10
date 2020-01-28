import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://192.168.0.4:3333' /** porta 3333 é a declarada  no meu backend*/
  baseURL: 'http://192.168.43.208:3333' /** porta 3333 é a declarada  no meu backend*/
});

export default api;