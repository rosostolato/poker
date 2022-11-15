import assert from 'assert';
import { Player } from './types';

export class Seats {
  playerTurn: number | null;
  seatsArray: (Player | null)[] = [];

  get currentPlayer(): Player | null {
    return this.playerTurn === null ? null : this.seatsArray[this.playerTurn];
  }

  get activePlayers(): Player[] {
    return this.seatsArray.filter(
      (player): player is Player => player?.status === 'active'
    );
  }

  get activePlayersCount(): number {
    return this.activePlayers.length;
  }

  get players(): Player[] {
    return this.seatsArray.filter((player): player is Player => !!player);
  }

  get playersCount(): number {
    return this.players.length;
  }

  constructor(length: number) {
    this.seatsArray = new Array(length).fill(null);
    this.playerTurn = null;
  }

  sitPlayer(seatIndex: number, buyIn: number): void {
    this.seatsArray[seatIndex] = {
      buyIn,
      bet: 0,
      chips: buyIn,
      seat: seatIndex,
      status: 'active',
    };
  }

  leavePlayer(seatIndex: number): void {
    this.seatsArray[seatIndex] = null;
    if (seatIndex === this.playerTurn) {
      this.nextPlayerTurn();
    }
  }

  nextPlayerTurn(): Player {
    if (this.playerTurn === null) {
      this.playerTurn = 0;
    } else {
      this.playerTurn = (this.playerTurn + 1) % this.seatsArray.length;
    }

    if (
      this.currentPlayer === null ||
      (this.activePlayersCount > 0 && this.currentPlayer!.status !== 'active')
    ) {
      this.nextPlayerTurn();
    }

    return this.currentPlayer!;
  }
}
