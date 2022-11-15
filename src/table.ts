import assert from 'assert';
import { instanceToPlain, plainToInstance, Type } from 'class-transformer';

import { Deck } from './deck';
import { Round } from './round';
import { Seats } from './seats';
import { Action, Card, Player, RoundState, WinnersResult } from './types';

export class Table {
  @Type(() => Deck)
  private readonly deck: Deck;
  @Type(() => Seats)
  private readonly seats: Seats;

  @Type(() => Round)
  private round: Round | null;
  private blinds: [number, number];

  get cards(): Card[] {
    return this.round?.tableCards ?? [];
  }

  get isHandInProgress(): boolean {
    return this.round !== null;
  }

  get isBettingRoundInProgress(): boolean {
    return this.round?.isBettingRoundInProgress ?? false;
  }

  get areBettingRoundsCompleted(): boolean {
    return this.round?.areBettingRoundsCompleted ?? false;
  }

  get numOfSeats(): number {
    return this.seats.seatsArray.length;
  }

  get players(): Player[] {
    return this.seats.players;
  }

  get playersCount(): number {
    return this.seats.playersCount;
  }

  get playerSeats(): (Player | null)[] {
    return this.seats.seatsArray;
  }

  get playerTurn(): number | null {
    return this.seats.playerTurn;
  }

  get pot(): number {
    return this.round?.pot ?? 0;
  }

  get rounBet(): number {
    return this.round?.roundBet ?? 0;
  }

  get roundOfBetting(): RoundState | null {
    return this.round?.state ?? null;
  }

  constructor(maxPlayers: number, blinds: [number, number]) {
    if (arguments.length > 0) {
      this.blinds = blinds;
      this.deck = new Deck(52);
      this.seats = new Seats(maxPlayers);
      this.round = null;
    }
  }

  endBettingRound(): void {
    assert(this.round !== null, 'No round in progress');
    this.round.endBettingRound();
  }

  endHand(): void {
    assert(this.round !== null, 'No round in progress');
    this.round.payWinners();
    this.round = null;
  }

  getLegalActions(): Action[] {
    return this.round?.getLegalActions() ?? [];
  }

  getPlayer(seatIndex: number): Player | null {
    return this.seats.seatsArray[seatIndex];
  }

  getPlayerCards(seatIndex: number): [Card, Card] | null {
    return this.round?.playerCards[seatIndex] ?? null;
  }

  showdown(): WinnersResult {
    assert(this.round !== null, 'No round in progress');
    return this.round.showdown();
  }

  startHand(): void {
    this.round = new Round(this.deck, this.seats, this.blinds);
  }

  sitPlayer(seatIndex: number, buyIn: number): void {
    this.seats.sitPlayer(seatIndex, buyIn);
  }

  leavePlayer(seatIndex: number): void {
    this.seats.leavePlayer(seatIndex);
  }

  takeAction(action: Action, raiseBet?: number): void {
    assert(this.round !== null, 'No round in progress');
    this.round.takeAction(action, raiseBet);
  }

  toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Table {
    return plainToInstance(Table, JSON.parse(json));
  }
}
