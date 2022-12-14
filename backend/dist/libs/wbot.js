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
const { struct } = require('pb-util');
const fs = require('fs');
const { MessageMedia } = require("whatsapp-web.js");
const request = require('request');


function nomedafuncao(agent) {
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

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
            function delay(t, v) {
              return new Promise(function (resolve) {
                setTimeout(resolve.bind(null, v), t)
              });
            }
            wbot.sendPresenceAvailable();
            const keyword = msg.body.toLowerCase();
            const date = new Date();
            const seconds = date.getSeconds();
            const minutes = date.getMinutes() * 60;
            const hour = date.getHours() * 60 * 60;
            const horario_atual = parseInt(hour) + parseInt(minutes) + parseInt(seconds);
            console.log(horario_atual);

            const inicioAtendimento = await db.getHorarioInicio();
            const hoursInicio = inicioAtendimento.split(':')[0] * 60 * 60;
            const minutesInicio = inicioAtendimento.split(':')[1] * 60;
            const secondsInicio = inicioAtendimento.split(':')[2];
            const horario_inicio = parseInt(hoursInicio) + parseInt(minutesInicio) + parseInt(secondsInicio);
            console.log(horario_inicio);

            const terminoAtendimento = await db.getHorarioTermino();
            const hoursTermino = terminoAtendimento.split(':')[0] * 60 * 60;
            const minutesTermino = terminoAtendimento.split(':')[1] * 60;
            const secondsTermino = terminoAtendimento.split(':')[2];
            const horario_final = parseInt(hoursTermino) + parseInt(minutesTermino) + parseInt(secondsTermino);
            console.log(horario_final);

            let chatBotStatus = 'off';

            //console.log('Estou no wbot: ' + msg.from.split('@')[0])
            chatBotStatus = await db.getChatBot(msg.from.split('@')[0]);
            console.log('ChatBot: ' + chatBotStatus);

            if (horario_atual > horario_inicio && horario_atual > horario_final) {
              let msgOut = await db.getOutOfTimeMsg();
              if (!msgOut) {
                msgOut = "Estamos fora do nosso hor??rio de atendimento, por favor, entre em contato novamente mais tarde";
              }
              delay(1000).then(function () {
                msg.reply(msgOut);
              });

              /*const media = await whatsapp_web_js_1.MessageMedia.fromUrl("https://app.goneweb.com.br/base/static/images/silatec.jpeg")

              delay(1000).then(function () {
                msg.reply(media);
              });*/
            } else {
              if (chatBotStatus === "ok") {
                if (keyword === '99') {
                  await db.setBotTicket(msg.from.split('@')[0], 'N');
                  delay(1000).then(function () {
                    msg.reply('Seu atendimento est?? sendo encaminhado para um atendente...');
                  });
                } else {
                  let primeirocontato = await db.getPrimeiroContato(msg.from.split('@')[0]);
                  if (primeirocontato === 0) {
                    // enviar saudacao
                    let saudacao = await db.getReply('saudacao');
                    console.log('saudacao:' + saudacao);
                    let achei = 'N??o consegui entender sua pergunta.\r\n*99 - Para falar com atendente.*';

                    if (saudacao) {
                      saudacao.forEach((resp) => {
                        achei = resp.resposta;
                      });
                    }

                    delay(1000).then(function () {
                      msg.reply(achei);
                    });
                  } else  {
                    let resposta = await db.getReply(keyword);
                    if (!resposta){
                      const bot = await db.getBotTicket2(msg.from.split('@')[0]);
                      if (bot.toLowerCase() === 's') {
                        delay(1000).then(function () {
                          msg.reply('N??o consegui entender sua pergunta.\r\n*99 - Para falar com atendente.*');
                        });
                      }
                    } else {
                      let replyMessage = 'N??o consegui entender sua pergunta.\r\n*99 - Para falar com atendente.*';
                      let idDep = '0';
                      resposta.forEach((resp, i) => {
                        replyMessage = resp.resposta;
                        idDep = resp.idDepartamento;
                      })
                      console.log('Achei a resposta ' + replyMessage);
                      logger_1.logger.info(`Acessando MYSQL: ${sessionName} OK`);
                      const bot = await db.getBotTicket2(msg.from.split('@')[0],idDep);
                      if (bot.toLowerCase() === 's') {
                        delay(1000).then(function () {
                          msg.reply(replyMessage);
                        });
                      } else {
                        delay(1000).then(function () {
                          msg.reply('Esse atendimento esta sendo feito por um humano \r\n *Foi voc?? que solicitou acima.*');
                        });
                      }
                    }
                  }
                }
              }
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
