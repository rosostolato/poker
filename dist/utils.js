"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
const crypto_1 = require("crypto");
function shuffle(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = (0, crypto_1.randomInt)(index + 1);
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }
}
exports.shuffle = shuffle;
//# sourceMappingURL=utils.js.map