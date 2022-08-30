const { delay } = require('bluebird');
const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
}

const getReply = async (keyword) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT resposta,idDepartamento FROM chatbots WHERE pergunta = ?', [keyword]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getOutOfTimeMsg = async () => {
  function delay(t, v) {
    return new Promise(function (resolve) {
      setTimeout(resolve.bind(null, v), t)
    });
  }

  const connection = await createConnection();
  const [rows] = await connection.execute('SELECT s.value FROM Settings s WHERE s.`key` = "msgOutOfTime"');
  delay(1000).then(async function(){
    await connection.end();
    delay(500).then(async function(){
      connection.destroy();
    });
  });
  if (rows.length > 0) return rows[0].value;
  return false;
}

const getAgendamento = async (dataEnvio) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT * FROM agendamentos WHERE dataEnvio = ? AND statusEnvio != "Enviado"', [dataEnvio]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const setAgendamento = async (id) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE agendamentos SET statusEnvio = "Enviado" WHERE id = ?', [id]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getChatBot = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT status FROM statuschatbots WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].status;
	return false;
}

const getChatBot2 = async (contato) => {
	const connection = await createConnection();
	let ipsel = "select c.number, cb.status from Contacts c inner join statuschatbots cb on cb.msgFrom = c.number where c.id = " + contato;
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	const [rows] = await connection.execute(ipsel);
	if (rows.length > 0) return rows[0].status;
	return false;
}

const setChatBotOff = async (msgFrom) => {
	const connection = await createConnection();
	try {
		let ipsel = "SELECT t.id FROM Contacts c INNER JOIN Tickets t ON t.contactId = c.id WHERE c.number = '" + msgFrom + "'  ORDER BY t.id DESC LIMIT 1"
		let [retorno] = await connection.execute(ipsel);
		let upd = "update Tickets set status = 'pending', chatbot = 'N' where id = " + retorno[0].id;
		const [rows] = await connection.execute(upd);

		//const [rows] = await connection.execute('UPDATE statuschatbots SET status = "off" WHERE msgFrom = ?', [msgFrom]);
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		if (rows.length > 0) return rows;
		return false;
	} catch (error) {
		console.log('Erro: ' + error)
		return false;
	}

}

const setChatBotOn = async (msgFrom) => {
	const connection = await createConnection();
	try {
		let ipsel = "SELECT t.id FROM Contacts c INNER JOIN Tickets t ON t.contactId = c.id WHERE c.number = '" + msgFrom + "'  ORDER BY t.id DESC LIMIT 1"
		let [retorno] = await connection.execute(ipsel);
		let upd = "update Tickets set status = 'bot', chatbot = 'S' where id = " + retorno[0].id;
		const [rows] = await connection.execute(upd);

		//const [rows] = await connection.execute('UPDATE statuschatbots SET status = "ok" WHERE msgFrom = ?', [msgFrom]);
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		if (rows.length > 0) return rows;
		return false;
	} catch (error) {
		console.log('Erro: ' + error)
		return false;
	}

}

const getDialogFlowAudio = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT status FROM dialogFlowaudios WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].status;
	return false;
}

const setDialogOffAudio = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE dialogFlowaudios SET status = "off" WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const setDialogOnAudio = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE dialogFlowaudios SET status = "ok" WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getDialogFlow = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT status FROM dialogFlows WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].status;
	return false;
}

const setDialogOff = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE dialogFlows SET status = "off" WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const setDialogOn = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE dialogFlows SET status = "ok" WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const setContactDialog = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO dialogFlows (`id`, `msgFrom`) VALUES (NULL, ?);', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getContactDialog = async (msgFrom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT * FROM dialogFlows WHERE msgFrom = ?', [msgFrom]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const getHorarioInicio = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT inicio FROM horariochatbots');
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].inicio;
	return false;
}

const getHorarioTermino = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT termino FROM horariochatbots');
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].termino;
	return false;
}

const getLimiteUsuario = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT * FROM limiteconexoes');
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].user;
	return false;
}

const getLimiteWhatsApp = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT whatsapp FROM limiteconexoes');
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].whatsapp;
	return false;
}

const setProtocolo = async (usuario, protocolo) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO protocolos (`id`, `usuario`, `protocolo`) VALUES (NULL, ?, ?);', [usuario, protocolo]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getWhatsAppId = async (ticketid) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT whatsappId FROM Tickets WHERE id = ?', [ticketid]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getActiveWhatsAppId = async (wppid) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT * FROM Whatsapps WHERE id = ?', [wppid]);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const getBotTicket = async (contato) => {
	const connection = await createConnection();
	let ipsel = "SELECT t.chatbot FROM Tickets t where t.id = " + contato;
	console.log(ipsel);
	const [rows] = await connection.execute(ipsel);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].chatbot;
	return false;
}

const setBotTicket = async (contato, st) => {
	const connection = await createConnection();
	try {
		let ipsel = "SELECT t.id FROM Contacts c INNER JOIN Tickets t ON t.contactId = c.id WHERE t.status <> 'closed' and c.number = '" + contato + "'  ORDER BY t.id DESC LIMIT 1";
		let [retorno] = await connection.execute(ipsel);
		let upd = "update Tickets set chatbot = '" + st + "', status = 'pending', chatbot = 'N' where id = " + retorno[0].id;
		const [rows] = await connection.execute(upd);
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		if (rows.length > 0) return true;
		return false;
	} catch (error) {
		return false;
	}
}

const setTicketClose = async (contato) => {
	const connection = await createConnection();
	try {
		let ipsel = "SELECT t.id FROM Contacts c INNER JOIN Tickets t ON t.contactId = c.id WHERE c.number = '" + contato + "'  ORDER BY t.id DESC LIMIT 1";
		console.log('Ticket Close: ' + ipsel);
		let [retorno] = await connection.execute(ipsel);
		let upd = "update Tickets set chatbot = 'N', status = 'willclosed' where id = " + retorno[0].id;
		console.log(upd);
		const [rows] = await connection.execute(upd);
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		if (rows.length > 0) return true;
		return false;
	} catch (error) {
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		return false;
	}
}

const getBotTicket2 = async (contato,idDep) => {
	const connection = await createConnection();
	let ipsel = "SELECT t.chatbot, t.id FROM Contacts c INNER JOIN Tickets t ON t.contactId = c.id WHERE t.status <> 'closed' and c.number = '" + contato + "'  ORDER BY t.id DESC LIMIT 1";
	console.log('getBotTicket2: ' + ipsel)
	let [rows] = await connection.execute(ipsel);
	if (rows.length > 0) {
		if (idDep !== 'N'){
		   let upd = "update Tickets set queueId = " + idDep + " where id = " + rows[0].id;
		   await connection.execute(upd);
		}
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		return rows[0].chatbot;
	} else {
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
	    return 'N';
	}
}

const getPrimeiroContato = async (contato) => {
	const connection = await createConnection();
	let ipsel = "SELECT COUNT(*) AS total FROM Tickets t INNER JOIN Contacts c ON c.id = t.contactId INNER JOIN Messages m ON m.ticketId = t.id WHERE t.status <> 'closed' AND c.number = '" + contato + "' AND m.fromMe = 1";
	//console.log(ipsel);
	let [rows] = await connection.execute(ipsel);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].total;
	return '0';
}

const updateChatBot = async (contato) => {
	try {
		let ipsel = "SELECT id FROM statuschatbots WHERE msgFrom = '" + contato + "'";
		let [retorno] = await connection.execute(ipsel);
		if (retorno.length = 0)
		{
			const [rows] = await connection.execute('INSERT INTO statuschatbots (`msgFrom`) VALUES (?);', [contato]);
			delay(1000).then(async function(){
				await connection.end();
				delay(500).then(async function(){
					connection.destroy();
				});
			});
			if (rows.length > 0) return true;
			return false;
			}
	} catch (error) {
		delay(1000).then(async function(){
			await connection.end();
			delay(500).then(async function(){
				connection.destroy();
			});
		});
		return false;
	}
}

const getStatusAtual = async (ticket) => {
	let ipsel = 'SELECT st.status FROM Tickets t INNER JOIN Contacts c ON c.id = t.contactId INNER JOIN statuschatbots st ON st.msgFrom = c.number WHERE t.id = ' + ticket;
	const connection = await createConnection();
	let [rows] = await connection.execute(ipsel);
	delay(1000).then(async function(){
		await connection.end();
		delay(500).then(async function(){
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].status;
	return 'off';
}


module.exports = {
	createConnection,
	getReply,
	getAgendamento,
	setAgendamento,
	getDialogFlow,
	setDialogOff,
	setDialogOn,
	getDialogFlowAudio,
	setDialogOffAudio,
	setDialogOnAudio,
	setContactDialog,
	getContactDialog,
	getChatBot,
	setChatBotOn,
	setChatBotOff,
	getHorarioInicio,
	getHorarioTermino,
	getLimiteUsuario,
	getLimiteWhatsApp,
	setProtocolo,
	getWhatsAppId,
	getActiveWhatsAppId,
	getBotTicket,
	setBotTicket,
	getChatBot2,
	getBotTicket2,
	getPrimeiroContato,
	updateChatBot,
	getStatusAtual,
	setTicketClose,
  getOutOfTimeMsg
}
