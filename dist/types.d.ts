export declare type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export declare type CardSuit = 'c' | 'd' | 'h' | 's';
export declare type Card = `${CardRank}${CardSuit}`;
export declare type Action = 'fold' | 'check' | 'call' | 'raise';
export interface Player {
    bet: number;
    buyIn: number;
    chips: number;
    seat: number;
    status: PlayerStatus;
}
export declare type PlayerStatus = 'active' | 'checked' | 'folded' | 'allIn';
export declare type RoundState = 'preflop' | 'flop' | 'turn' | 'river';
