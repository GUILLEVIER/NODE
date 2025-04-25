const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.score = "/score";
    this.users = "/users";
    this.middlewares();
    this.connectDB();
    this.routes();
  }

  middlewares() {
    this.app.use(cors({ origin: "https://alexander-001.github.io" }));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  async connectDB() {
    try {
      mongoose.connect(process.env.DB_MONGO, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      console.log("Mongo database connected");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  routes() {
    //* Api schedules
    this.app.use(this.users, require("../routes/users.routes"));
    this.app.use(this.score, require("../routes/scores.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Listening on port " + this.port);
    });
  }
}

module.exports = Server;
