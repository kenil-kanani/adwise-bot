"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_API_KEY = exports.OPENAI_API_KEY = exports.BOT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
exports.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
