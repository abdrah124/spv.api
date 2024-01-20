"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket_Id = exports.errorsMessage = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.BCRYPT_SALT = exports.HOST = exports.PORT = exports.COOKIE_SECRET = exports.BASE_CLIENT_URL = exports.BASE_URL = void 0;
exports.BASE_URL = process.env.BASE_WEB_URL;
exports.BASE_CLIENT_URL = process.env.CLIENT_URL;
exports.COOKIE_SECRET = process.env.COOKIE_SECRET;
exports.PORT = process.env.PORT;
exports.HOST = process.env.HOST;
exports.BCRYPT_SALT = process.env.BCRYPT_SALT;
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.errorsMessage = Object.freeze({
    FILE_TOO_BIG: "The file size exceeds the maximum allowed limit. Please upload a file that is equals to 300kb or fewer.",
    FILE_MIME_TYPE: "Invalid file mime types, accepted types: .jpg, .jpeg, .png, .webp",
});
const SOCKET_ID = Object.freeze({
    ROOM: "chat_room_",
    USER: "u_",
});
const Socket_Id = (id, types) => `${SOCKET_ID[types]}${id}`;
exports.Socket_Id = Socket_Id;