import { Hand } from 'pokersolver';
import { Deck } from './deck';
import { Seats } from './seats';
import { Action, Card, RoundState } from './types';
export declare class Round {
    readonly blinds: [number, number];
    readonly deck: Deck;
    readonly seats: Seats;
    areBettingRoundsCompleted: boolean;
    isBettingRoundInProgress: boolean;
    playerCards: {
        [seat: number]: [Card, Card];
    };
    pot: number;
    roundBet: number;
    state: RoundState;
    tableCards: Card[];
    winners: {
        [seat: number]: Hand;
    };
    constructor(deck: Deck, seats: Seats, blinds: [number, number]);
    endBettingRound(): void;
    getLegalActions(): Action[];
    showdown(): void;
    payWinners(): void;
    takeAction(action: Action, raiseBet?: number): void;
    private dealPlayerCards;
    private payBlinds;
    private updatePlayerStatus;
}
