import assert from 'assert';
import { Type } from 'class-transformer';
// @ts-ignore
import { Hand } from 'pokersolver';

import { Deck } from './deck';
import { Seats } from './seats';
import { Action, Card, Player, RoundState } from './types';

export class Round {
  readonly blinds: [number, number];
  @Type(() => Deck)
  readonly deck: Deck;
  @Type(() => Seats)
  readonly seats: Seats;

  areBettingRoundsCompleted: boolean;
  isBettingRoundInProgress: boolean;
  playerCards: { [seat: number]: [Card, Card] };
  pot: number;
  roundBet: number;
  state: RoundState;
  tableCards: Card[];
  winners: { [seat: number]: Hand };

  constructor(deck: Deck, seats: Seats, blinds: [number, number]) {
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

  endBettingRound(): void {
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
    } else if (this.state === 'flop') {
      this.tableCards.push(this.deck.draw());
      this.state = 'turn';
    } else if (this.state === 'turn') {
      this.tableCards.push(this.deck.draw());
      this.state = 'river';
    } else if (this.state === 'river') {
      this.isBettingRoundInProgress = false;
      this.areBettingRoundsCompleted = true;
    }
  }

  getLegalActions(): Action[] {
    const actions: Action[] = ['fold'];
    const player = this.seats.currentPlayer;
    assert(player, 'No player at seat');

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

  showdown(): void {
    assert(this.areBettingRoundsCompleted, 'Betting rounds are not completed');

    const results = this.seats.players.map(player => {
      const hand = Hand.solve([
        ...this.tableCards,
        ...this.playerCards[player.seat],
      ]);
      return {
        player,
        hand,
      };
    });

    const winner = Hand.winners(results.map(result => result.hand));
    const winners = Array.isArray(winner) ? winner : [winner];

    this.winners = winners.reduce((acc, winner) => {
      const result = results.find(result => result.hand === winner);
      assert(result, 'No result found for winner');
      return {
        ...acc,
        [result.player.seat]: winner,
      };
    }, {} as { [seat: number]: Hand });
  }

  payWinners(): void {
    // TODO: hanle remainder chips
    const playerSeats = Object.keys(this.winners);
    assert(playerSeats.length > 0, 'No winners to pay');
    const winnerChips = Math.floor(this.pot / playerSeats.length);
    playerSeats.forEach(seat => {
      const player = this.seats.getPlayer(Number(seat))!;
      player.chips += winnerChips;
    });
  }

  takeAction(action: Action, raiseBet?: number): void {
    assert(this.isBettingRoundInProgress, 'Betting round is not in progress');

    const player = this.seats.currentPlayer;
    assert(player, 'No player at seat');

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
        assert(raiseBet <= player.chips, 'Not enough chips to raise');
        assert(
          player.bet + raiseBet > this.roundBet,
          'Raise must be greater than current bet'
        );
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

  private dealPlayerCards(): void {
    this.playerCards = this.seats.seatsArray.reduce((acc, player, i) => {
      if (player) {
        acc[i] = [this.deck.draw(), this.deck.draw()];
      }
      return acc;
    }, {} as { [seat: number]: [Card, Card] });
  }

  private payBlinds(): void {
    const smallBlindPlayer = this.seats.nextPlayerTurn();
    const bigBlindPlayer = this.seats.nextPlayerTurn();

    smallBlindPlayer.bet = this.blinds[0];
    smallBlindPlayer.chips -= this.blinds[0];
    bigBlindPlayer.bet = this.blinds[1];
    bigBlindPlayer.chips -= this.blinds[1];
    this.roundBet = this.blinds[1];

    this.seats.nextPlayerTurn();
  }

  private updatePlayerStatus(player: Player, isRaise?: boolean): void {
    if (player.chips === 0) {
      player.status = 'allIn';
    } else {
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
