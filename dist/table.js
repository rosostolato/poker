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
var assert_1 = __importDefault(require("assert"));
var class_transformer_1 = require("class-transformer");
var deck_1 = require("./deck");
var round_1 = require("./round");
var seats_1 = require("./seats");
var Table = /** @class */ (function () {
    function Table(maxPlayers, blinds) {
        if (arguments.length > 0) {
            this._blinds = blinds;
            this._deck = new deck_1.Deck(52);
            this._seats = new seats_1.Seats(maxPlayers);
            this._round = null;
        }
    }
    Object.defineProperty(Table.prototype, "cards", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.tableCards) !== null && _b !== void 0 ? _b : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "isHandInProgress", {
        get: function () {
            return this._round !== null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "isBettingRoundInProgress", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.isBettingRoundInProgress) !== null && _b !== void 0 ? _b : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "areBettingRoundsCompleted", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.areBettingRoundsCompleted) !== null && _b !== void 0 ? _b : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "numOfSeats", {
        get: function () {
            return this.seats.seatsArray.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "players", {
        get: function () {
            return this.seats.players;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "playersCount", {
        get: function () {
            return this.seats.playersCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "playerSeats", {
        get: function () {
            return this.seats.seatsArray;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "playerTurn", {
        get: function () {
            return this.seats.playerTurn;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "pot", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.pot) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "rounBet", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.roundBet) !== null && _b !== void 0 ? _b : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "roundOfBetting", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.state) !== null && _b !== void 0 ? _b : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "winners", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.winners) !== null && _b !== void 0 ? _b : {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "seats", {
        get: function () {
            var _a, _b;
            var seats = (_a = this._seats) !== null && _a !== void 0 ? _a : (_b = this._round) === null || _b === void 0 ? void 0 : _b.seats;
            (0, assert_1.default)(seats, 'Seats not initialized');
            return seats;
        },
        enumerable: false,
        configurable: true
    });
    Table.prototype.sitPlayer = function (seatIndex, buyIn) {
        this.seats.sitPlayer(seatIndex, buyIn);
    };
    Table.prototype.leavePlayer = function (seatIndex) {
        this.seats.leavePlayer(seatIndex);
    };
    Table.prototype.startHand = function () {
        this._round = new round_1.Round(this._deck, this._seats, this._blinds);
        this._deck = null;
        this._seats = null;
    };
    Table.prototype.endHand = function () {
        (0, assert_1.default)(this._round !== null, 'No round in progress');
        this._round.payWinners();
        this._deck = this._round.deck;
        this._seats = this._round.seats;
        this._round = null;
    };
    Table.prototype.endBettingRound = function () {
        (0, assert_1.default)(this._round !== null, 'No round in progress');
        this._round.endBettingRound();
    };
    Table.prototype.showdown = function () {
        (0, assert_1.default)(this._round !== null, 'No round in progress');
        this._round.showdown();
    };
    Table.prototype.getLegalActions = function () {
        var _a, _b;
        return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.getLegalActions()) !== null && _b !== void 0 ? _b : [];
    };
    Table.prototype.getPlayer = function (seatIndex) {
        return this.seats.getPlayer(seatIndex);
    };
    Table.prototype.getPlayerCards = function (seatIndex) {
        var _a, _b;
        return (_b = (_a = this._round) === null || _a === void 0 ? void 0 : _a.playerCards[seatIndex]) !== null && _b !== void 0 ? _b : null;
    };
    Table.prototype.takeAction = function (action, raiseBet) {
        (0, assert_1.default)(this._round !== null, 'No round in progress');
        this._round.takeAction(action, raiseBet);
    };
    Table.prototype.toJSON = function () {
        return JSON.stringify((0, class_transformer_1.instanceToPlain)(this));
    };
    Table.fromJSON = function (json) {
        return (0, class_transformer_1.plainToInstance)(Table, JSON.parse(json));
    };
    __decorate([
        (0, class_transformer_1.Type)(function () { return deck_1.Deck; })
    ], Table.prototype, "_deck", void 0);
    __decorate([
        (0, class_transformer_1.Type)(function () { return seats_1.Seats; })
    ], Table.prototype, "_seats", void 0);
    __decorate([
        (0, class_transformer_1.Type)(function () { return round_1.Round; })
    ], Table.prototype, "_round", void 0);
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=table.js.map