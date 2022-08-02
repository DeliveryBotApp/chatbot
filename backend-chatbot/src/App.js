//import express
const express = require('express');
const app = express();
require("./bootstrap");

//setting port
app.set('port', process.env.POST||process.env.PORT);

//Middlewares
app.use(express.json());


//configurasi cros json
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const perguntasRouters = require('./routes/PerguntasRoute');
app.use('/perguntas', perguntasRouters);

const agendamentoRouters = require('./routes/AgendamentoRoute');
app.use('/agendamento', agendamentoRouters);
/*
const dialogFlowRouters = require('./routes/DialogFlowRoute');
app.use('/dialogFlow', dialogFlowRouters);

const dialogFlowAudioRouters = require('./routes/DialogFlowAudioRoute');
app.use('/dialogFlowAudio', dialogFlowAudioRouters);
*/

const chatBotRouters = require('./routes/ChatBotRoute');
app.use('/chatBot', chatBotRouters);

const horarioRouters = require('./routes/HorarioRoute');
app.use('/horario', horarioRouters);

const limiteRouters = require('./routes/LimiteRoute');
app.use('/limite', limiteRouters);

const protocoloRouters = require('./routes/ProtocoloRoute');
app.use('/protocolo', protocoloRouters);

app.use('/', (req, res) => {
    res.send("Olá, seja bem vindo a Comunidade ZDG.");
});

app.listen(app.get('port'), () => {
    console.log("Iniciando o Servidor");
});
