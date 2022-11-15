"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
var utils_1 = require("./utils");
var suitMap = ['s', 'h', 'd', 'c'];
var rankMap = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'T',
    'J',
    'Q',
    'K',
    'A',
];
var Deck = /** @class */ (function () {
    function Deck(size) {
        if (arguments.length > 0) {
            this.cards = [];
            this.size = size;
            var index = 0;
            for (var suit = 0; suit < 4; suit++) {
                for (var rank = 0; rank < 13; rank++) {
                    this.cards[index++] = this.createCard(rank, suit);
                }
            }
            this.restart();
        }
    }
    Deck.prototype.draw = function () {
        if (this.size === 0) {
            this.restart();
        }
        return this.cards[--this.size];
    };
    Deck.prototype.restart = function () {
        this.size = 52;
        (0, utils_1.shuffle)(this.cards);
    };
    Deck.prototype.createCard = function (rank, suit) {
        return "".concat(rankMap[rank]).concat(suitMap[suit]);
    };
    return Deck;
}());
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map