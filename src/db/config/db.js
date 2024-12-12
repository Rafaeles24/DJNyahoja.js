const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqlite3.db',
    logging: false
})

module.exports = sequelize;
