export type Card = string;

export type Action = 'fold' | 'check' | 'call' | 'raise';

export interface Player {
  bet: number;
  buyIn: number;
  chips: number;
  seat: number;
  status: PlayerStatus;
}

export type PlayerStatus = 'active' | 'checked' | 'folded' | 'allIn';

export type RoundState = 'preflop' | 'flop' | 'turn' | 'river';

export interface WinnersResult {
  playerCards: { [seat: number]: [Card, Card] };
  winners: Player[];
}
