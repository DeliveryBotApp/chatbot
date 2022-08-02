const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
}

const updateChatBot = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO statuschatbots (msgFrom) SELECT number FROM Contacts t1 WHERE t1.number NOT IN (SELECT msgFrom FROM statuschatbots)');
	if (rows.length > 0) return true;
	return false;
}

module.exports = {
	createConnection,
	updateChatBot
}
