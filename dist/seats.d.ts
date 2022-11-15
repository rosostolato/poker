import { Player } from './types';
export declare class Seats {
    playerTurn: number | null;
    seatsArray: (Player | null)[];
    get currentPlayer(): Player | null;
    get activePlayers(): Player[];
    get activePlayersCount(): number;
    get players(): Player[];
    get playersCount(): number;
    constructor(length: number);
    getPlayer(seatIndex: number): Player | null;
    sitPlayer(seatIndex: number, buyIn: number): void;
    leavePlayer(seatIndex: number): void;
    nextPlayerTurn(): Player;
}
