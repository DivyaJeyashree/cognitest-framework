"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareScreenshots = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const pngjs_1 = require("pngjs");
const pixelmatch_1 = __importDefault(require("pixelmatch"));
const compareScreenshots = async (baselinePath, actualPath, diffPath) => {
    const [baselinePng, actualPng] = await Promise.all([
        promises_1.default.readFile(baselinePath),
        promises_1.default.readFile(actualPath)
    ]);
    const baseline = pngjs_1.PNG.sync.read(baselinePng);
    const actual = pngjs_1.PNG.sync.read(actualPng);
    const diff = new pngjs_1.PNG({ width: baseline.width, height: baseline.height });
    const mismatchPixels = (0, pixelmatch_1.default)(baseline.data, actual.data, diff.data, baseline.width, baseline.height, { threshold: 0.1 });
    await promises_1.default.writeFile(diffPath, pngjs_1.PNG.sync.write(diff));
    return { mismatchPixels, diffPath };
};
exports.compareScreenshots = compareScreenshots;
