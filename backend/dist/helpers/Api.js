const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
}

const getApiToken = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT * FROM Settings WHERE `key` = "userApiToken"');
	if (rows.length > 0) return rows[0].value;
	return false;
}

module.exports = {
	createConnection,
	getApiToken
}