"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Round = void 0;
var assert_1 = __importDefault(require("assert"));
var class_transformer_1 = require("class-transformer");
// @ts-ignore
var pokersolver_1 = require("pokersolver");
var deck_1 = require("./deck");
var seats_1 = require("./seats");
var Round = /** @class */ (function () {
    function Round(deck, seats, blinds) {
        if (arguments.length > 0) {
            this.blinds = blinds;
            this.deck = deck;
            this.seats = seats;
            this.winners = {};
            this.areBettingRoundsCompleted = false;
            this.isBettingRoundInProgress = true;
            this.state = 'preflop';
            this.playerCards = {};
            this.tableCards = [];
            this.roundBet = 0;
            this.pot = 0;
            this.dealPlayerCards();
            this.payBlinds();
        }
    }
    Round.prototype.endBettingRound = function () {
        var _this = this;
        this.roundBet = 0;
        this.isBettingRoundInProgress = true;
        this.seats.players.forEach(function (player) {
            _this.pot += player.bet;
            player.status = 'active';
            player.bet = 0;
        });
        if (this.state === 'preflop') {
            this.tableCards = [this.deck.draw(), this.deck.draw(), this.deck.draw()];
            this.state = 'flop';
        }
        else if (this.state === 'flop') {
            this.tableCards.push(this.deck.draw());
            this.state = 'turn';
        }
        else if (this.state === 'turn') {
            this.tableCards.push(this.deck.draw());
            this.state = 'river';
        }
        else if (this.state === 'river') {
            this.isBettingRoundInProgress = false;
            this.areBettingRoundsCompleted = true;
        }
    };
    Round.prototype.getLegalActions = function () {
        var actions = ['fold'];
        var player = this.seats.currentPlayer;
        (0, assert_1.default)(player, 'No player at seat');
        if (player.bet === this.roundBet) {
            actions.push('check');
        }
        if (player.bet < this.roundBet) {
            actions.push('call');
        }
        if (player.chips > 0) {
            actions.push('raise');
        }
        return actions;
    };
    Round.prototype.showdown = function () {
        var _this = this;
        (0, assert_1.default)(this.areBettingRoundsCompleted, 'Betting rounds are not completed');
        var results = this.seats.players.map(function (player) {
            var hand = pokersolver_1.Hand.solve(__spreadArray(__spreadArray([], _this.tableCards, true), _this.playerCards[player.seat], true));
            return {
                player: player,
                hand: hand,
            };
        });
        var winner = pokersolver_1.Hand.winners(results.map(function (result) { return result.hand; }));
        var winners = Array.isArray(winner) ? winner : [winner];
        this.winners = winners.reduce(function (acc, winner) {
            var _a;
            var result = results.find(function (result) { return result.hand === winner; });
            (0, assert_1.default)(result, 'No result found for winner');
            return __assign(__assign({}, acc), (_a = {}, _a[result.player.seat] = winner, _a));
        }, {});
    };
    Round.prototype.payWinners = function () {
        var _this = this;
        // TODO: hanle remainder chips
        var playerSeats = Object.keys(this.winners);
        (0, assert_1.default)(playerSeats.length > 0, 'No winners to pay');
        var winnerChips = Math.floor(this.pot / playerSeats.length);
        playerSeats.forEach(function (seat) {
            var player = _this.seats.getPlayer(Number(seat));
            player.chips += winnerChips;
        });
    };
    Round.prototype.takeAction = function (action, raiseBet) {
        (0, assert_1.default)(this.isBettingRoundInProgress, 'Betting round is not in progress');
        var player = this.seats.currentPlayer;
        (0, assert_1.default)(player, 'No player at seat');
        switch (action) {
            case 'call':
                var callAmount = Math.min(this.roundBet - player.bet, player.chips);
                player.bet += callAmount;
                player.chips -= callAmount;
                this.updatePlayerStatus(player);
                break;
            case 'check':
                player.status = 'checked';
                break;
            case 'fold':
                player.status = 'folded';
                break;
            case 'raise':
                raiseBet !== null && raiseBet !== void 0 ? raiseBet : (raiseBet = 1);
                (0, assert_1.default)(raiseBet <= player.chips, 'Not enough chips to raise');
                (0, assert_1.default)(player.bet + raiseBet > this.roundBet, 'Raise must be greater than current bet');
                player.bet += raiseBet;
                player.chips -= raiseBet;
                this.roundBet = player.bet;
                this.updatePlayerStatus(player, true);
                break;
        }
        var nextPlayer = this.seats.nextPlayerTurn();
        if (nextPlayer.status !== 'active') {
            this.isBettingRoundInProgress = false;
        }
    };
    Round.prototype.dealPlayerCards = function () {
        var _this = this;
        this.playerCards = this.seats.seatsArray.reduce(function (acc, player, i) {
            if (player) {
                acc[i] = [_this.deck.draw(), _this.deck.draw()];
            }
            return acc;
        }, {});
    };
    Round.prototype.payBlinds = function () {
        var smallBlindPlayer = this.seats.nextPlayerTurn();
        var bigBlindPlayer = this.seats.nextPlayerTurn();
        smallBlindPlayer.bet = this.blinds[0];
        smallBlindPlayer.chips -= this.blinds[0];
        bigBlindPlayer.bet = this.blinds[1];
        bigBlindPlayer.chips -= this.blinds[1];
        this.roundBet = this.blinds[1];
        this.seats.nextPlayerTurn();
    };
    Round.prototype.updatePlayerStatus = function (player, isRaise) {
        if (player.chips === 0) {
            player.status = 'allIn';
        }
        else {
            player.status = 'checked';
        }
        if (isRaise) {
            this.seats.players.forEach(function (seatPlayer) {
                if (seatPlayer !== player && seatPlayer.status === 'checked') {
                    seatPlayer.status = 'active';
                }
            });
        }
    };
    __decorate([
        (0, class_transformer_1.Type)(function () { return deck_1.Deck; })
    ], Round.prototype, "deck", void 0);
    __decorate([
        (0, class_transformer_1.Type)(function () { return seats_1.Seats; })
    ], Round.prototype, "seats", void 0);
    return Round;
}());
exports.Round = Round;
//# sourceMappingURL=round.js.map