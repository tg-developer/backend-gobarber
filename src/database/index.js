// O Sequelize é o cara responsável por fazer a conexão com o banco
import Sequelize from 'sequelize';

import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database';

// Criamos um array com os models importados
const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    // Metódo que inicia o banco de dados
    this.mongo();
  }

  // O método init vai fazer a conexão com a base de dados e carregar os models
  init() {
    // Foi importado as configurações do banco databaseConfig e colocado como parâmetro
    this.connection = new Sequelize(databaseConfig);

    // Através do this.connection temos a nossa conexão com o banco de dados, essa conexão está sendo esperada pelo models...
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
