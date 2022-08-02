"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWbot = exports.getWbot = exports.initWbot = void 0;
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const socket_1 = require("./socket");
const AppError_1 = __importDefault(require("../errors/AppError"));
const logger_1 = require("../utils/logger");
const wbotMessageListener_1 = require("../services/WbotServices/wbotMessageListener");
const db = require('../helpers/Db');
const sessions = [];
const util = require('util');
const {struct} = require('pb-util');
const fs = require('fs');
const {MessageMedia} = require("whatsapp-web.js");
const request = require('request');

//webhook dialogflow
const express = require('express');
const app2 = express();
const {WebhookClient} = require('@google-cloud/dialogflow');
const dialogflow = require('@google-cloud/dialogflow');

//webhook dialogflow
app2.post('/webhook', function(request,response){
    const agent = new WebhookClient ({ request, response });
    let intentMap = new Map();
    intentMap.set('nomedaintencao', nomedafuncao)
    agent.handleRequest(intentMap);
}); 
function nomedafuncao (agent) {
}  
app2.use(express.json());
app2.use(express.urlencoded({
    extended: true
}));
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
const sessionClient = new dialogflow.SessionsClient({keyFilename: process.env.DIALOG_FLOW_JSON});

//start wt
const syncUnreadMessages = (wbot) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield wbot.getChats();
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const chat of chats) {
        if (chat.unreadCount > 0) {
            const unreadMessages = yield chat.fetchMessages({
                limit: chat.unreadCount
            });
            for (const msg of unreadMessages) {
                yield wbotMessageListener_1.handleMessage(msg, wbot);
            }
            yield chat.sendSeen();
        }
    }
});

exports.initWbot = (whatsapp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const io = socket_1.getIO();
            const sessionName = whatsapp.name;
            let sessionCfg;
            if (whatsapp && whatsapp.session) {
                sessionCfg = JSON.parse(whatsapp.session);
            }
            const wbot = new whatsapp_web_js_1.Client({
                session: sessionCfg,
                authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: 'bd_' + whatsapp.id }),
                puppeteer: {
                    //          headless: false,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    executablePath: process.env.CHROME_BIN || undefined
                },
            });
            wbot.initialize();
            wbot.on("qr", (qr) => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.logger.info("Session:", sessionName);
                qrcode_terminal_1.default.generate(qr, { small: true });
                yield whatsapp.update({ qrcode: qr, status: "qrcode", retries: 0 });
                const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
                if (sessionIndex === -1) {
                    wbot.id = whatsapp.id;
                    sessions.push(wbot);
                }
                io.emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });
            }));
            wbot.on("authenticated", (session) => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.logger.info(`Session: ${sessionName} AUTHENTICATED`);
                //        await whatsapp.update({
                //          session: JSON.stringify(session)
                //        });
            }));
            wbot.on("auth_failure", (msg) => __awaiter(void 0, void 0, void 0, function* () {
                console.error(`Session: ${sessionName} AUTHENTICATION FAILURE! Reason: ${msg}`);
                if (whatsapp.retries > 1) {
                    yield whatsapp.update({ session: "", retries: 0 });
                }
                const retry = whatsapp.retries;
                yield whatsapp.update({
                    status: "DISCONNECTED",
                    retries: retry + 1
                });
                io.emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });
                reject(new Error("Error starting whatsapp session."));
            }));
            wbot.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.logger.info(`Session: ${sessionName} READY`);
                yield whatsapp.update({
                    status: "CONNECTED",
                    qrcode: "",
                    retries: 0
                });
                io.emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });
                const sessionIndex = sessions.findIndex(s => s.id === whatsapp.id);
                if (sessionIndex === -1) {
                    wbot.id = whatsapp.id;
                    sessions.push(wbot);
                }
                wbot.sendPresenceAvailable();
                yield syncUnreadMessages(wbot);
                resolve(wbot);
            }));
            wbot.on('message', async msg => {
                if (process.env.N8N !== "off") {
                console.log("© BOT-ZDG: Config N8N On")
                var options = {
                    'method': 'POST',
                    'url': process.env.N8N_WEBHOOK,
                    'headers': {
                      'Content-Type': 'application/json'
                    },
                    json: msg
                  };
            
                  request(options, function (error, response) {
                    if (error) {
                      throw new Error(error);
                    }
                    else {
                      console.log(response.body);
                    }
                  });
                }
                else {
                    console.log("© BOT-ZDG: Config N8N Off")
                }	
            });
            wbot.on('message', async msg => {
                function delay(t, v) {
                    return new Promise(function(resolve) { 
                        setTimeout(resolve.bind(null, v), t)
                    });
                 }
                wbot.sendPresenceAvailable();
                const keyword = msg.body.toLowerCase();
                const date = new Date();
                const seconds = date.getSeconds()*60;
                const minutes = date.getMinutes()*60*60;
                const hour = date.getHours()*24*60*60;
                //console.log(hour+minutes+seconds);
                const atendimentoZDG = hour+minutes+seconds;
                const inicioAtendimento = await db.getHorarioInicio();
                const hoursInicio = inicioAtendimento.split(':')[0]*24*60*60;
                const minutesInicio = inicioAtendimento.split(':')[1]*60*60;
                const secondsInicio = inicioAtendimento.split(':')[2]*60;
                //console.log(hoursInicio+minutesInicio+secondsInicio);
                const inicioAtendimentoZDG = hoursInicio+minutesInicio+secondsInicio;
                const terminoAtendimento = await db.getHorarioTermino();
                const hoursTermino = terminoAtendimento.split(':')[0]*24*60*60;
                const minutesTermino = terminoAtendimento.split(':')[1]*60*60;
                const secondsTermino = terminoAtendimento.split(':')[2]*60;
                const terminoAtendimentoZDG = hoursTermino+minutesTermino+secondsTermino;
                //console.log(hoursTermino+minutesTermino+secondsTermino);
                if (atendimentoZDG > inicioAtendimentoZDG && atendimentoZDG < terminoAtendimentoZDG){
                        const replyMessage = await db.getReply(keyword);
                        const chatBotStatus = await db.getChatBot(msg.from.split('@')[0]);
                        const st = await db.getStatusTicket(msg.from.split('@')[0]);
                        if (st !== false){
                            if (st !== 'bot'){
                                await db.setStatusTicket(msg.from.split('@')[0]);
                            }
                        }

                        if (chatBotStatus === "ok" && replyMessage !== false){
                            logger_1.logger.info(`Acessando MYSQL: ${sessionName} OK`);
                            console.log("© BOT-ZDG: Config Chatbot MYSQL ON");
                            delay(3000).then(function() {
                                msg.reply(replyMessage);
                            });   
                        }
                        else{
                            console.log("© BOT-ZDG: Config Chatbot MYSQL OFF");
                        }    
                }
                else {
                    console.log("© BOT-ZDG: Fora do horário de atendimento - MYSQL");
                    // delay(3000).then(function() {
                    //     msg.reply("O horário de atendimento é entre " + inicioAtendimento.split(':')[0] + ":" + inicioAtendimento.split(':')[1] + " e " + terminoAtendimento.split(':')[0] + ":" + terminoAtendimento.split(':')[1]);
                    // });  
                }

            });
            wbot.on('message', async msg => {
                function delay(t, v) {
                    return new Promise(function(resolve) { 
                        setTimeout(resolve.bind(null, v), t)
                    });
                 }
                wbot.sendPresenceAvailable();
                const date = new Date();
                const seconds = date.getSeconds()*60;
                const minutes = date.getMinutes()*60*60;
                const hour = date.getHours()*24*60*60;
                //console.log(hour+minutes+seconds);
                const atendimentoZDG = hour+minutes+seconds;
                const inicioAtendimento = await db.getHorarioInicio();
                const hoursInicio = inicioAtendimento.split(':')[0]*24*60*60;
                const minutesInicio = inicioAtendimento.split(':')[1]*60*60;
                const secondsInicio = inicioAtendimento.split(':')[2]*60;
                //console.log(hoursInicio+minutesInicio+secondsInicio);
                const inicioAtendimentoZDG = hoursInicio+minutesInicio+secondsInicio;
                const terminoAtendimento = await db.getHorarioTermino();
                const hoursTermino = terminoAtendimento.split(':')[0]*24*60*60;
                const minutesTermino = terminoAtendimento.split(':')[1]*60*60;
                const secondsTermino = terminoAtendimento.split(':')[2]*60;
                const terminoAtendimentoZDG = hoursTermino+minutesTermino+secondsTermino;
                //console.log(hoursTermino+minutesTermino+secondsTermino);
                if (process.env.DIALOG_FLOW_STATUS === "on"){
                    console.log("© BOT-ZDG: ENV Dialog ON")
                    //integração de texto dialogflow
                    let textoResposta = await executeQueries(process.env.DIALOG_FLOW_PROJECT_ID, msg.from, [msg.body], process.env.DIALOG_FLOW_LANGUAGE)
                    const dialogFlowStatus = await db.getDialogFlow(msg.from.split('@')[0]);
                    let textoRespostaAudio = await executeQueriesAudio("zdg-9un9", msg.from, [msg.body], 'pt-BR');
                    const dialogFlowStatusAudio = await db.getDialogFlowAudio(msg.from.split('@')[0]);
                    const chat = await msg.getChat();
                    //dialogflow mensagens
                    async function detectIntent(
                        projectId,
                        sessionId,
                        query,
                        contexts,
                        languageCode
                    ) {
                        const sessionPath = sessionClient.projectAgentSessionPath(
                        projectId,
                        sessionId
                        );
                    
                        // The text query request.
                        const request = {
                        session: sessionPath,
                        queryInput: {
                            text: {
                            text: query,
                            languageCode: languageCode,
                            },
                        },
                        };
                    
                        if (contexts && contexts.length > 0) {
                        request.queryParams = {
                            contexts: contexts,
                        };
                        }
                    
                        const responses = await sessionClient.detectIntent(request);
                        return responses[0];
                    }
                    async function executeQueries(projectId, sessionId, queries, languageCode) {
                        let context;
                        let intentResponse;
                        for (const query of queries) {
                            try {
                                console.log(`© BOT-ZDG: DialogFlow Texto - Pergunta: ${query}`);
                                intentResponse = await detectIntent(
                                    projectId,
                                    sessionId,
                                    query,
                                    context,
                                    languageCode
                                );
                                //console.log('Enviando Resposta');
                                if (isBlank(intentResponse.queryResult.fulfillmentText)){
                                    console.log('© BOT-ZDG: Sem resposta definida no DialogFlow Texto');
                                    return null;   
                                }
                                else {
                                    console.log('© BOT-ZDG: Resposta definida no DialogFlow Texto');
                                    console.log(intentResponse.queryResult.fulfillmentText);
                                    return `${intentResponse.queryResult.fulfillmentText}`
                                }
                                
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                    //dialogflow audio
                    async function detectIntentwithTTSResponse(projectId,
                        sessionId,
                        query,
                        languageCode) {
                        const sessionPath = sessionClient.projectAgentSessionPath(
                            projectId,
                            sessionId
                        );
                        // The audio query request
                        const request = {
                        session: sessionPath,
                        queryInput: {
                            text: {
                            text: query,
                            languageCode: languageCode,
                            },
                        },
                        outputAudioConfig: {
                            audioEncoding: 'OUTPUT_AUDIO_ENCODING_OGG_OPUS',
                        },
                        };
                        const responses = await sessionClient.detectIntent(request);
                        const audioFile = responses[0].outputAudio;
                        const outputFile = './public/' + sessionId + '.ogg';
                        util.promisify(fs.writeFile)(outputFile, audioFile, 'base64');
                        console.log(`© BOT-ZDG: Conteúdo do áudio gravado em: ${outputFile}`);
                        return responses[0];
                    }
                    async function executeQueriesAudio(projectId, sessionId, queries, languageCode) {
                        let intentResponse;
                        for (const query of queries) {
                            try {
                                console.log(`© BOT-ZDG: DialogFlow Áudio - Pergunta:: ${query}`);
                                intentResponse = await detectIntentwithTTSResponse(
                                    projectId,
                                    sessionId,
                                    query,
                                    languageCode
                                );
                                console.log('© BOT-ZDG: Enviando Resposta de Áudio');
                                if (isBlank(intentResponse.queryResult.fulfillmentText)){
                                    console.log('© BOT-ZDG: Sem resposta definida no DialogFlow Áudio');
                                    return null;   
                                }
                                else {
                                    console.log('© BOT-ZDG: Resposta definida no DialogFlow Áudio');
                                    console.log(intentResponse.queryResult.fulfillmentText);
                                    return `${intentResponse.queryResult.fulfillmentText}`
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                    if (atendimentoZDG > inicioAtendimentoZDG && atendimentoZDG < terminoAtendimentoZDG){
                        if (dialogFlowStatus === "ok" && dialogFlowStatusAudio === "ok" && textoResposta !== null){
                            console.log("© BOT-ZDG: Config Dialog Texto e Aúdio ON");
                            const mediaResposta = MessageMedia.fromFilePath('./public/' + msg.from + '.ogg');
                            delay(3000).then(function() {
                                if(textoResposta === undefined){
                                    return
                                }
                                msg.reply("*BOT ZDG:*\n" + textoResposta.replace(/\\n/g, '\n'));
                            });    
                            delay(4000).then(function() {
                                if(textoRespostaAudio === undefined){
                                    return
                                }
                                msg.reply(textoRespostaAudio + "\n\n🔊 Estou gravando uma mensagem para você.");
                                //console.log("Enviando Aúdio");
                                chat.sendStateRecording();
                            });
                            delay(5000).then(function() {
                                wbot.sendMessage(msg.from, mediaResposta, {sendAudioAsVoice: true});
                            });  
                        }
                        if (dialogFlowStatus === "ok" && dialogFlowStatusAudio === "off" && textoResposta !== null){
                            console.log("© BOT-ZDG: Config Dialog Texto ON - Áudio OFF");
                            delay(3000).then(function() {
                                msg.reply("*BOT ZDG:*\n" + textoResposta.replace(/\\n/g, '\n'));
                            });  
                        }
                        if (dialogFlowStatus === "off" && dialogFlowStatusAudio === "ok" && textoResposta !== null){
                            console.log("© BOT-ZDG: Config Dialog Texto OFF - Aúdio ON");
                            const mediaResposta = MessageMedia.fromFilePath('./public/' + msg.from + '.ogg');
                            delay(4000).then(function() {
                                msg.reply(textoRespostaAudio + "\n\n🔊 Estou gravando uma mensagem para você.");
                                //console.log("Enviando Aúdio");
                                chat.sendStateRecording();
                            });
                            delay(5000).then(function() {
                                wbot.sendMessage(msg.from, mediaResposta, {sendAudioAsVoice: true});
                            });  
                        }
                        if (dialogFlowStatus === "off" && dialogFlowStatusAudio === "off" && textoResposta !== null){
                            console.log("© BOT-ZDG: Config Dialog Off");
                        }
                    }
                    else {
                        console.log("© BOT-ZDG: Fora do horário de atendimento - DIALOG");
                        delay(3000).then(function() {
                            msg.reply("O horário de atendimento é entre " + inicioAtendimento.split(':')[0] + ":" + inicioAtendimento.split(':')[1] + " e " + terminoAtendimento.split(':')[0] + ":" + terminoAtendimento.split(':')[1]);
                        }); 
                    }
                }
                else{
                    console.log('© BOT-ZDG: ENV Dialog OFF')
                }
            });
        }
        catch (err) {
            logger_1.logger.error(err);
        }
    });
});
exports.getWbot = (whatsappId) => {
    const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
    if (sessionIndex === -1) {
        throw new AppError_1.default("ERR_WAPP_NOT_INITIALIZED");
    }
    return sessions[sessionIndex];
};
exports.removeWbot = (whatsappId) => {
    try {
        const sessionIndex = sessions.findIndex(s => s.id === whatsappId);
        if (sessionIndex !== -1) {
            sessions[sessionIndex].destroy();
            sessions.splice(sessionIndex, 1);
        }
    }
    catch (err) {
        logger_1.logger.error(err);
    }
};
