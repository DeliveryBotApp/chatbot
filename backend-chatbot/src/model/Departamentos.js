const Sequelize = require('sequelize');
var sequelize = require('./database_1');

var nametable = 'Queues';

var departamento = sequelize.define(nametable, {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name: Sequelize.TEXT('long'),
    color: Sequelize.TEXT('long'),
    greetingMessage: Sequelize.TEXT('long')
})

module.exports = departamento;
