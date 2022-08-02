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
const { delay } = require("bluebird");
const date_fns_1 = require("date-fns");
const sequelize_1 = require("sequelize");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const ShowTicketService_1 = __importDefault(require("./ShowTicketService"));

const db = require('../../helpers/Db');

const FindOrCreateTicketService = (contact, whatsappId, unreadMessages, groupContact) => __awaiter(void 0, void 0, void 0, function* () {
    let ticket = yield Ticket_1.default.findOne({
        where: {
            status: {
                [sequelize_1.Op.or]: ["open", "pending", "bot"]
            },
            contactId: groupContact ? groupContact.id : contact.id
        }
    });
    if (ticket) {
        if (ticket.status !== 'open' && ticket.status !== 'closed') {
            console.log('aqui agora ' + ticket.id)
            let st = "pending";
            let bot = "N";
            bot = yield db.getBotTicket(ticket.id)
            if (bot !== false) {
                if (bot.toLowerCase() === 's') {
                    st = "bot";
                }
                if (bot.toLowerCase() === '0') {
                    st = "closed";
                }
            }
            yield ticket.update({ unreadMessages, status: st });
        } else {
            yield ticket.update({ unreadMessages });
            console.log('aqui agora 5' + ticket.id)
        }
    }
    if (!ticket && groupContact) {
        ticket = yield Ticket_1.default.findOne({
            where: {
                contactId: groupContact.id
            },
            order: [["updatedAt", "DESC"]]
        });
        if (ticket) {
            console.log('aqui 3')
            let st = "pending";
            let bot = "N";
            bot = yield db.getBotTicket(ticket.id)
            console.log('Ret Bot: ' + bot)
            if (bot.toLowerCase() === 's') {
                st = "bot";
                console.log('Bot: ' + st)
            }
            yield ticket.update({
                status: st,
                userId: null,
                unreadMessages
            });
        }
    }
    if (!ticket && !groupContact) {
        console.log('Estou aqui agora 2 ')
        ticket = yield Ticket_1.default.findOne({
            where: {
                updatedAt: {
                    [sequelize_1.Op.between]: [+date_fns_1.subHours(new Date(), 1), +new Date()]
                },
                contactId: contact.id
            },
            order: [["updatedAt", "DESC"]]
        });
        if (ticket) {
            console.log('Status atual: ' + ticket.status)
            let bot = "N";  
            let chat = "S";              
            bot = yield db.getBotTicket(ticket.id)
            if (ticket.status === 'closed' && bot !== '0') {
                yield ticket.update({
                    status: 'bot',
                    userId: null,
                    unreadMessages,
                    chatbot: chat
                });
            } else {
                let st = "pending";
                console.log('Ret Bot: ' + bot)
                if (bot !== false) {
                    if (bot.toLowerCase() === 's') {
                        st = "bot";
                        console.log('Bot: ' + st)
                    }
                    if (bot.toLowerCase() === '0') {
                        st = "closed";
                        chat = "N";
                        console.log('Bot: ' + st)
                    }
                }
                yield ticket.update({
                    status: st,
                    userId: null,
                    unreadMessages,
                    chatbot: chat                                     
                });
            }
        }
    }
    if (!ticket) {
        console.log('Inclui um novo ticket')
        // ver se existe o contato ja na tabela statuschatbot
        yield db.updateChatBot();
        let st = "pending";
        let bot = "N";
        bot = yield db.getChatBot2(contact.id)
        console.log('Ret Chatbot: ' + bot)
        if (bot.toLowerCase() === 'ok') {
            st = "bot";
            console.log('Bot: ' + st)
        }
        yield ticket = yield Ticket_1.default.create({
            contactId: groupContact ? groupContact.id : contact.id,
            status: st,
            isGroup: !!groupContact,
            unreadMessages,
            whatsappId
        });
    }
    ticket = yield ShowTicketService_1.default(ticket.id);
    return ticket;
});
exports.default = FindOrCreateTicketService;
