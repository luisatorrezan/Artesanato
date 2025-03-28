const Sequelize = require('sequelize');
const connection = require('./database');

const Cadastrar = connection.define('cadastrar', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    imagem: {
        type: Sequelize.BLOB('long'),  // Tipo BLOB para armazenar imagens
        allowNull: true
    }
});

Cadastrar.sync({ force: false });  // Cria a tabela se não existir
module.exports = Cadastrar;