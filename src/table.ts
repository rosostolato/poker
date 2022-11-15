import assert from 'assert';
import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
// @ts-ignore
import { Hand } from 'pokersolver';

import { Deck } from './deck';
import { Round } from './round';
import { Seats } from './seats';
import { Action, Card, Player, RoundState } from './types';

export class Table {
  @Type(() => Deck)
  private _deck: Deck | null;
  @Type(() => Seats)
  private _seats: Seats | null;
  @Type(() => Round)
  private _round: Round | null;
  private _blinds: [number, number];

  get cards(): Card[] {
    return this._round?.tableCards ?? [];
  }

  get isHandInProgress(): boolean {
    return this._round !== null;
  }

  get isBettingRoundInProgress(): boolean {
    return this._round?.isBettingRoundInProgress ?? false;
  }

  get areBettingRoundsCompleted(): boolean {
    return this._round?.areBettingRoundsCompleted ?? false;
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
    return this._round?.pot ?? 0;
  }

  get rounBet(): number {
    return this._round?.roundBet ?? 0;
  }

  get roundOfBetting(): RoundState | null {
    return this._round?.state ?? null;
  }

  get winners(): { [seat: number]: Hand } {
    return this._round?.winners ?? {};
  }

  private get seats(): Seats {
    const seats = this._seats ?? this._round?.seats;
    assert(seats, 'Seats not initialized');
    return seats;
  }

  constructor(maxPlayers: number, blinds: [number, number]) {
    if (arguments.length > 0) {
      this._blinds = blinds;
      this._deck = new Deck(52);
      this._seats = new Seats(maxPlayers);
      this._round = null;
    }
  }

  sitPlayer(seatIndex: number, buyIn: number): void {
    this.seats.sitPlayer(seatIndex, buyIn);
  }

  leavePlayer(seatIndex: number): void {
    this.seats.leavePlayer(seatIndex);
  }

  startHand(): void {
    this._round = new Round(this._deck!, this._seats!, this._blinds);
    this._deck = null;
    this._seats = null;
  }

  endHand(): void {
    assert(this._round !== null, 'No round in progress');
    this._round.payWinners();
    this._deck = this._round.deck;
    this._seats = this._round.seats;
    this._round = null;
  }

  endBettingRound(): void {
    assert(this._round !== null, 'No round in progress');
    this._round.endBettingRound();
  }

  showdown(): void {
    assert(this._round !== null, 'No round in progress');
    this._round.showdown();
  }

  getLegalActions(): Action[] {
    return this._round?.getLegalActions() ?? [];
  }

  getPlayer(seatIndex: number): Player | null {
    return this.seats.getPlayer(seatIndex);
  }

  getPlayerCards(seatIndex: number): [Card, Card] | null {
    return this._round?.playerCards[seatIndex] ?? null;
  }

  takeAction(action: Action, raiseBet?: number): void {
    assert(this._round !== null, 'No round in progress');
    this._round.takeAction(action, raiseBet);
  }

  toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Table {
    return plainToInstance(Table, JSON.parse(json));
  }
}
