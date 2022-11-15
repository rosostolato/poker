import { Deck } from './deck';
import { Seats } from './seats';
import { Action, Card, RoundState, WinnersResult } from './types';
export declare class Round {
    areBettingRoundsCompleted: boolean;
    isBettingRoundInProgress: boolean;
    playerCards: {
        [seat: number]: [Card, Card];
    };
    tableCards: Card[];
    roundBet: number;
    state: RoundState;
    pot: number;
    private winners;
    private readonly blinds;
    private readonly deck;
    private readonly seats;
    constructor(deck: Deck, seats: Seats, blinds: [number, number]);
    endBettingRound(): void;
    getLegalActions(): Action[];
    showdown(): WinnersResult;
    payWinners(): void;
    takeAction(action: Action, raiseBet?: number): void;
    private dealPlayerCards;
    private payBlinds;
    private updatePlayerStatus;
}
