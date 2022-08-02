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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const GetTicketWbot_1 = __importDefault(require("../../helpers/GetTicketWbot2"));
const axios = require('axios');
const mime = require('mime-types');
const whatsapp_web_js_1 = require("whatsapp-web.js");
const SendWhatsAppMedia2 = ({ number, url, title, ticketwhatsappId }) => __awaiter(void 0, void 0, void 0, function* () {
    const wbot2 = yield GetTicketWbot_1.default(ticketwhatsappId);
    const fileUrl = url;
    const caption = title;
    let mimetype;
    const attachment = yield axios.get(fileUrl, {
        responseType: 'arraybuffer'
    }).then(response => {
        mimetype = response.headers['content-type'];
        return response.data.toString('base64');
    });
    const media = new whatsapp_web_js_1.MessageMedia(mimetype, attachment, 'Media');
    try {
        const sentMessage2 = yield wbot2.sendMessage(number, media, {caption: caption});
        return sentMessage2;
    }
    catch (err) {
        throw new AppError_1.default("ERR_SENDING_WAPP_MSG");
    }
});
exports.default = SendWhatsAppMedia2;
