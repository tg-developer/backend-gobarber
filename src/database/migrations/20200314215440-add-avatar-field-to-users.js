module.exports = {
  up: (queryInterface, Sequelize) => {
    // Adicionamos uma nova coluna na tabela users chamada avatar_id
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      // Faz referência a tabela files e ao id
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
