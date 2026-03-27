"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJsonData = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const readJsonData = async (filePath) => {
    const payload = await promises_1.default.readFile(filePath, "utf8");
    return JSON.parse(payload);
};
exports.readJsonData = readJsonData;
