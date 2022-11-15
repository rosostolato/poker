"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seats = void 0;
class Seats {
    playerTurn;
    seatsArray = [];
    get currentPlayer() {
        return this.playerTurn === null ? null : this.seatsArray[this.playerTurn];
    }
    get activePlayers() {
        return this.seatsArray.filter((player) => player?.status === 'active');
    }
    get activePlayersCount() {
        return this.activePlayers.length;
    }
    get players() {
        return this.seatsArray.filter((player) => !!player);
    }
    get playersCount() {
        return this.players.length;
    }
    constructor(length) {
        if (arguments.length > 0) {
            this.seatsArray = new Array(length).fill(null);
            this.playerTurn = null;
        }
    }
    sitPlayer(seatIndex, buyIn) {
        this.seatsArray[seatIndex] = {
            buyIn,
            bet: 0,
            chips: buyIn,
            seat: seatIndex,
            status: 'active',
        };
    }
    leavePlayer(seatIndex) {
        this.seatsArray[seatIndex] = null;
        if (seatIndex === this.playerTurn) {
            this.nextPlayerTurn();
        }
    }
    nextPlayerTurn() {
        if (this.playerTurn === null) {
            this.playerTurn = 0;
        }
        else {
            this.playerTurn = (this.playerTurn + 1) % this.seatsArray.length;
        }
        if (this.currentPlayer === null ||
            (this.activePlayersCount > 0 && this.currentPlayer.status !== 'active')) {
            this.nextPlayerTurn();
        }
        return this.currentPlayer;
    }
}
exports.Seats = Seats;
//# sourceMappingURL=seats.js.map