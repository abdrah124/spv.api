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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeChatRoomSimplified = exports.normalizeChatRooms = void 0;
const chat_normalize_1 = require("./chat.normalize");
const normalizeChatRooms = (room) => new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
    return resolve({
        createdAt: room.createdAt,
        id: room.id,
        picture: room.groupPicture,
        isGroupChat: room.isGroupChat,
        messages: yield Promise.all(room.messages.map((message) => Promise.resolve((0, chat_normalize_1.normalizeChat)(message)))),
        totalUnreadMessages: room._count.messages,
        updatedAt: room.updatedAt,
        description: room.description,
        title: room.title,
        participants: yield Promise.all(room.participants.map((participant) => Promise.resolve((0, chat_normalize_1.normalizeChatParticipant)(participant)))),
        totalParticipants: room._count.participants,
        applyType: room.applyType,
        groupVisibility: room.groupVisibility,
    });
}));
exports.normalizeChatRooms = normalizeChatRooms;
const normalizeChatRoomSimplified = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.resolve({
        applyType: payload.applyType,
        createdAt: payload.createdAt,
        id: payload.id,
        groupVisibility: payload.groupVisibility,
        isGroupChat: payload.isGroupChat,
        picture: payload.groupPicture,
        totalParticipants: payload._count.participants,
        updatedAt: payload.updatedAt,
        description: payload.description,
        title: payload.title,
    });
});
exports.normalizeChatRoomSimplified = normalizeChatRoomSimplified;
