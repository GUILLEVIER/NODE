require("dotenv").config();
const Server = require("./src/services/index");

const server = new Server();

server.listen();
