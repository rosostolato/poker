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
exports.Round = void 0;
const assert_1 = __importDefault(require("assert"));
const class_transformer_1 = require("class-transformer");
// @ts-ignore
const pokersolver_1 = require("pokersolver");
const deck_1 = require("./deck");
const seats_1 = require("./seats");
class Round {
    areBettingRoundsCompleted;
    isBettingRoundInProgress;
    playerCards;
    tableCards;
    roundBet;
    state;
    pot;
    winners;
    blinds;
    deck;
    seats;
    constructor(deck, seats, blinds) {
        if (arguments.length > 0) {
            this.blinds = blinds;
            this.deck = deck;
            this.seats = seats;
            this.winners = [];
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
    endBettingRound() {
        this.roundBet = 0;
        this.isBettingRoundInProgress = true;
        this.seats.players.forEach(player => {
            this.pot += player.bet;
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
    }
    getLegalActions() {
        const actions = ['fold'];
        const player = this.seats.currentPlayer;
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
    }
    showdown() {
        (0, assert_1.default)(this.areBettingRoundsCompleted, 'Betting rounds are not completed');
        const results = this.seats.players.map(player => {
            const hand = pokersolver_1.Hand.solve([
                ...this.tableCards,
                ...this.playerCards[player.seat],
            ]);
            return {
                player,
                hand,
            };
        });
        const winner = pokersolver_1.Hand.winners(results.map(result => result.hand));
        const winners = Array.isArray(winner) ? winner : [winner];
        this.winners = winners.map(winner => {
            const result = results.find(result => result.hand === winner);
            (0, assert_1.default)(result, 'No result found for winner');
            return result.player;
        });
        return {
            playerCards: this.playerCards,
            winners: this.winners,
        };
    }
    payWinners() {
        (0, assert_1.default)(this.winners.length > 0, 'No winners to pay');
        // TODO: hanle remainder chips
        const winnerChips = Math.floor(this.pot / this.winners.length);
        this.winners.forEach(winner => {
            winner.chips += winnerChips;
        });
    }
    takeAction(action, raiseBet) {
        (0, assert_1.default)(this.isBettingRoundInProgress, 'Betting round is not in progress');
        const player = this.seats.currentPlayer;
        (0, assert_1.default)(player, 'No player at seat');
        switch (action) {
            case 'call':
                const callAmount = Math.min(this.roundBet - player.bet, player.chips);
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
                raiseBet ??= 1;
                (0, assert_1.default)(raiseBet <= player.chips, 'Not enough chips to raise');
                (0, assert_1.default)(player.bet + raiseBet > this.roundBet, 'Raise must be greater than current bet');
                player.bet += raiseBet;
                player.chips -= raiseBet;
                this.roundBet = player.bet;
                this.updatePlayerStatus(player, true);
                break;
        }
        const nextPlayer = this.seats.nextPlayerTurn();
        if (nextPlayer.status !== 'active') {
            this.isBettingRoundInProgress = false;
        }
    }
    dealPlayerCards() {
        this.playerCards = this.seats.seatsArray.reduce((acc, player, i) => {
            if (player) {
                acc[i] = [this.deck.draw(), this.deck.draw()];
            }
            return acc;
        }, {});
    }
    payBlinds() {
        const smallBlindPlayer = this.seats.nextPlayerTurn();
        const bigBlindPlayer = this.seats.nextPlayerTurn();
        smallBlindPlayer.bet = this.blinds[0];
        smallBlindPlayer.chips -= this.blinds[0];
        bigBlindPlayer.bet = this.blinds[1];
        bigBlindPlayer.chips -= this.blinds[1];
        this.roundBet = this.blinds[1];
        this.seats.nextPlayerTurn();
    }
    updatePlayerStatus(player, isRaise) {
        if (player.chips === 0) {
            player.status = 'allIn';
        }
        else {
            player.status = 'checked';
        }
        if (isRaise) {
            this.seats.players.forEach(seatPlayer => {
                if (seatPlayer !== player && seatPlayer.status === 'checked') {
                    seatPlayer.status = 'active';
                }
            });
        }
    }
}
__decorate([
    (0, class_transformer_1.Type)(() => deck_1.Deck)
], Round.prototype, "deck", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => seats_1.Seats)
], Round.prototype, "seats", void 0);
exports.Round = Round;
//# sourceMappingURL=round.js.map