"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const assert_1 = __importDefault(require("assert"));
const class_transformer_1 = require("class-transformer");
const deck_1 = require("./deck");
const round_1 = require("./round");
const seats_1 = require("./seats");
class Table {
    deck;
    seats;
    round;
    blinds;
    get cards() {
        return this.round?.tableCards ?? [];
    }
    get isHandInProgress() {
        return this.round !== null;
    }
    get isBettingRoundInProgress() {
        return this.round?.isBettingRoundInProgress ?? false;
    }
    get areBettingRoundsCompleted() {
        return this.round?.areBettingRoundsCompleted ?? false;
    }
    get numOfSeats() {
        return this.seats.seatsArray.length;
    }
    get players() {
        return this.seats.players;
    }
    get playersCount() {
        return this.seats.playersCount;
    }
    get playerSeats() {
        return this.seats.seatsArray;
    }
    get playerTurn() {
        return this.seats.playerTurn;
    }
    get pot() {
        return this.round?.pot ?? 0;
    }
    get rounBet() {
        return this.round?.roundBet ?? 0;
    }
    get roundOfBetting() {
        return this.round?.state ?? null;
    }
    constructor(maxPlayers, blinds) {
        if (arguments.length > 0) {
            this.blinds = blinds;
            this.deck = new deck_1.Deck(52);
            this.seats = new seats_1.Seats(maxPlayers);
            this.round = null;
        }
    }
    endBettingRound() {
        (0, assert_1.default)(this.round !== null, 'No round in progress');
        this.round.endBettingRound();
    }
    endHand() {
        (0, assert_1.default)(this.round !== null, 'No round in progress');
        this.round.payWinners();
        this.round = null;
    }
    getLegalActions() {
        return this.round?.getLegalActions() ?? [];
    }
    getPlayer(seatIndex) {
        return this.seats.seatsArray[seatIndex];
    }
    getPlayerCards(seatIndex) {
        return this.round?.playerCards[seatIndex] ?? null;
    }
    showdown() {
        (0, assert_1.default)(this.round !== null, 'No round in progress');
        return this.round.showdown();
    }
    startHand() {
        this.round = new round_1.Round(this.deck, this.seats, this.blinds);
    }
    sitPlayer(seatIndex, buyIn) {
        this.seats.sitPlayer(seatIndex, buyIn);
    }
    leavePlayer(seatIndex) {
        this.seats.leavePlayer(seatIndex);
    }
    takeAction(action, raiseBet) {
        (0, assert_1.default)(this.round !== null, 'No round in progress');
        this.round.takeAction(action, raiseBet);
    }
    toJSON() {
        return JSON.stringify((0, class_transformer_1.instanceToPlain)(this));
    }
    static fromJSON(json) {
        return (0, class_transformer_1.plainToInstance)(Table, JSON.parse(json));
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => deck_1.Deck)
], Table.prototype, "deck", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => seats_1.Seats)
], Table.prototype, "seats", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => round_1.Round)
], Table.prototype, "round", void 0);
exports.Table = Table;
//# sourceMappingURL=table.js.map