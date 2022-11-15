"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seats = void 0;
var Seats = /** @class */ (function () {
    function Seats(length) {
        this.seatsArray = [];
        if (arguments.length > 0) {
            this.seatsArray = new Array(length).fill(null);
            this.playerTurn = null;
        }
    }
    Object.defineProperty(Seats.prototype, "currentPlayer", {
        get: function () {
            return this.playerTurn === null ? null : this.seatsArray[this.playerTurn];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Seats.prototype, "activePlayers", {
        get: function () {
            return this.seatsArray.filter(function (player) { return (player === null || player === void 0 ? void 0 : player.status) === 'active'; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Seats.prototype, "activePlayersCount", {
        get: function () {
            return this.activePlayers.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Seats.prototype, "players", {
        get: function () {
            return this.seatsArray.filter(function (player) { return !!player; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Seats.prototype, "playersCount", {
        get: function () {
            return this.players.length;
        },
        enumerable: false,
        configurable: true
    });
    Seats.prototype.getPlayer = function (seatIndex) {
        return this.seatsArray[seatIndex];
    };
    Seats.prototype.sitPlayer = function (seatIndex, buyIn) {
        this.seatsArray[seatIndex] = {
            buyIn: buyIn,
            bet: 0,
            chips: buyIn,
            seat: seatIndex,
            status: 'active',
        };
    };
    Seats.prototype.leavePlayer = function (seatIndex) {
        this.seatsArray[seatIndex] = null;
        if (seatIndex === this.playerTurn) {
            this.nextPlayerTurn();
        }
    };
    Seats.prototype.nextPlayerTurn = function () {
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
    };
    return Seats;
}());
exports.Seats = Seats;
//# sourceMappingURL=seats.js.map