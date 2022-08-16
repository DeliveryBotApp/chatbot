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
                [sequelize_1.Op.or]: ["open", "pending", "bot","willclosed"]
            },
            contactId: groupContact ? groupContact.id : contact.id
        }
    });    
    if (ticket) {
        yield ticket.update({ unreadMessages });
    }  
    if (ticket) {
        if (ticket.status === 'willclosed'){
            console.log('Status atual 1: ' + ticket.status);
            yield ticket.update({ unreadMessages, status: 'closed',  chatbot: 'N' });     
        } else {            
            console.log('Aqui agora 1 ' + ticket.id)
            let statual = ticket.status;
            console.log('Status atual: ' + statual);
            let st = ticket.status;
            let bot = "";
            let chat = ticket.chatbot;
            bot = yield db.getStatusAtual(ticket.id);            
            if (statual === 'bot'){
                if (bot === "ok"){
                    st = 'bot'; 
                    chat = 'S';                 
                }  else {  
                    st = 'pending';
                    chat = 'N';
                }            
            }
            if (statual === 'open'){
                if (bot === "ok"){
                    if (chat !== 'N')
                    {
                       st = 'bot'; 
                       chat = 'S';                 
                    } else {
                        st = 'open';
                        chat = 'N';    
                    }
                }  else {  
                    st = 'open';
                    chat = 'N';
                }            
            }
            if (statual === 'pending'){
                if (bot === "ok"){
                    if (chat !== 'N'){
                        st = 'bot'; 
                        chat = 'S';       
                    } else {
                        st = 'pending';
                        chat = 'N';    
                    }         
                }  else {  
                    st = 'pending';
                    chat = 'N';
                }            
            }
            yield ticket.update({ unreadMessages, status: st,  chatbot: chat });
        }
    } else if (!ticket) {
        console.log('Mensagem: ' + unreadMessages);
        if (unreadMessages !== '00'){
            console.log('Incluindo ticket ');
            let st = "pending";
            let bot = "N";
            bot = yield db.getChatBot2(contact.id)
            if (bot !== false){
                if (bot.toLowerCase() === 'ok') {
                    st = "bot";
                }
            }
            yield ticket = yield Ticket_1.default.create({
                contactId: groupContact ? groupContact.id : contact.id,
                status: st,
                isGroup: !!groupContact,
                unreadMessages,
                whatsappId
            });
        } 
    }    
    ticket = yield ShowTicketService_1.default(ticket.id);
    return ticket;
});
exports.default = FindOrCreateTicketService;
