import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    // Dentro do super.init nós enviamos as colunas do nosso banco de dados
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `{process.env.APP_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
