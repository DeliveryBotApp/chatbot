"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const upload_1 = __importDefault(require("../config/upload"));
const MessageController = __importStar(require("../controllers/MessageController"));
const messageRoutes = express_1.Router();
const upload = multer_1.default(upload_1.default);
messageRoutes.get("/messages/:ticketId", isAuth_1.default, MessageController.index);
messageRoutes.post("/messages/:ticketId", isAuth_1.default, upload.array("medias"), MessageController.store);
messageRoutes.post("/zdg", MessageController.store2);
messageRoutes.post("/zdgGroups", MessageController.store3);
messageRoutes.post("/zdgGroupsDescription", MessageController.store4);
messageRoutes.post("/zdgGroupsCreate", MessageController.store5);
messageRoutes.post("/sendSms", MessageController.store6);
messageRoutes.post("/makeVoiceCall", MessageController.store7);
messageRoutes.post("/sendMedia", MessageController.store8);
messageRoutes.post("/sendDirect", MessageController.store9);
messageRoutes.post("/sendList", MessageController.store10);
messageRoutes.post("/sendButton", MessageController.store11);
messageRoutes.post("/sendAgendamento", MessageController.store12);
messageRoutes.post("/syncMessage", MessageController.store13);
messageRoutes.post("/zdgGroupsMessage", MessageController.store14);
messageRoutes.post("/zdgCloseGroup", MessageController.store15);
messageRoutes.post("/zdgOpenGroup", MessageController.store16);
messageRoutes.post("/zdgNASA", MessageController.store17);
messageRoutes.post("/zdgDialogFlowOn", MessageController.store18);
messageRoutes.post("/zdgDialogFlowOff", MessageController.store19);
messageRoutes.post("/zdgChatBotOn", MessageController.store20);
messageRoutes.post("/zdgChatBotOff", MessageController.store21);
messageRoutes.post("/zdgProtocolo", MessageController.store22);
messageRoutes.post("/zdgDialogFlowOnAudio", MessageController.store23);
messageRoutes.post("/zdgDialogFlowOffAudio", MessageController.store24);
messageRoutes.post("/zdgSyncMessageUser", MessageController.store25);
messageRoutes.post("/zdgGetWppId", MessageController.store26);
messageRoutes.post("/zdgSendEmail", MessageController.store27);
messageRoutes.post("/zdgSendEmailAttach", MessageController.store28);
messageRoutes.delete("/messages/:messageId", isAuth_1.default, MessageController.remove);
exports.default = messageRoutes;