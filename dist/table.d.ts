import { Action, Card, Player, RoundState, WinnersResult } from './types';
export declare class Table {
    private _deck;
    private _seats;
    private _round;
    private _blinds;
    get cards(): Card[];
    get isHandInProgress(): boolean;
    get isBettingRoundInProgress(): boolean;
    get areBettingRoundsCompleted(): boolean;
    get numOfSeats(): number;
    get players(): Player[];
    get playersCount(): number;
    get playerSeats(): (Player | null)[];
    get playerTurn(): number | null;
    get pot(): number;
    get rounBet(): number;
    get roundOfBetting(): RoundState | null;
    private get deck();
    private get seats();
    constructor(maxPlayers: number, blinds: [number, number]);
    sitPlayer(seatIndex: number, buyIn: number): void;
    leavePlayer(seatIndex: number): void;
    startHand(): void;
    endHand(): void;
    endBettingRound(): void;
    showdown(): WinnersResult;
    getLegalActions(): Action[];
    getPlayer(seatIndex: number): Player | null;
    getPlayerCards(seatIndex: number): [Card, Card] | null;
    takeAction(action: Action, raiseBet?: number): void;
    toJSON(): string;
    static fromJSON(json: string): Table;
}
