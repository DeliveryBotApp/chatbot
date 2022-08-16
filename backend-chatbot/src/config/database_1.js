"use strict";
require("../bootstrap");
module.exports = {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "wzap",
    username: process.env.DB_USER || "g_one",
    password: process.env.DB_PASS || "123mudar"
};
