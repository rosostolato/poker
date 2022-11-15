"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const utils_1 = require("./utils");
const suitMap = ['s', 'h', 'd', 'c'];
const rankMap = [
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
class Deck {
    cards;
    size;
    constructor(size) {
        if (arguments.length > 0) {
            this.cards = [];
            this.size = size;
            let index = 0;
            for (let suit = 0; suit < 4; suit++) {
                for (let rank = 0; rank < 13; rank++) {
                    this.cards[index++] = this.createCard(rank, suit);
                }
            }
            this.restart();
        }
    }
    draw() {
        if (this.size === 0) {
            this.restart();
        }
        return this.cards[--this.size];
    }
    restart() {
        this.size = 52;
        (0, utils_1.shuffle)(this.cards);
    }
    createCard(rank, suit) {
        return `${rankMap[rank]}${suitMap[suit]}`;
    }
}
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map