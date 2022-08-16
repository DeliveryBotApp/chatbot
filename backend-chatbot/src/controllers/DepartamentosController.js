const controllers = {}

var sequelize = require('../model/database_1');
var departamentos = require('../model/Departamentos');

sequelize.sync();

controllers.list = async (req, res) => {
    const data = await departamentos.findAll()
    .then(function(data){
        return data;
    })
    .catch(error => {
        return error;
    })

    res.json({
        success: true,
        data: data
    });
}


module.exports = controllers;