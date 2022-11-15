export type CardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'T'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';
export type CardSuit = 'c' | 'd' | 'h' | 's';

export type Card = `${CardRank}${CardSuit}`;

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
