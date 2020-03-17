require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // Cria uma coluna para o banco de dados
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
