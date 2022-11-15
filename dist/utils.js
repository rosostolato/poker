"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
var crypto_1 = require("crypto");
function shuffle(array) {
    var _a;
    for (var index = array.length - 1; index > 0; index--) {
        var newIndex = (0, crypto_1.randomInt)(index + 1);
        _a = [array[newIndex], array[index]], array[index] = _a[0], array[newIndex] = _a[1];
    }
}
exports.shuffle = shuffle;
//# sourceMappingURL=utils.js.map