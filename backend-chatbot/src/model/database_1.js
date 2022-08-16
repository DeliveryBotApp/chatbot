const dbConfig = require("../config/database_1");
var Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;