declare module 'pokersolver' {
  type PokerGame =
    | 'standard'
    | 'jacksbetter'
    | 'joker'
    | 'deuceswild'
    | 'threecard'
    | 'fourcard'
    | 'fourcardbonus'
    | 'paigowpokerfull'
    | 'paigowpokeralt'
    | 'paigowpokersf6'
    | 'paigowpokersf7'
    | 'paigowpokerhi'
    | 'paigowpokerlo';

  class Hand {
    /** All of the cards passed into the hand. */
    cardPool: string[];

    /** All of the cards involved in the identified hand type. */
    cards: string[];

    /** Detailed description of the identified hand type (Two Pair, A's & Q's for example). */
    descr: string;

    /** Type of hand identified (Two Pair for example). */
    name: string;

    /** Ranking of the hand type (Varies from game to game; 0 being the lowest hand). */
    rank: number;

    /**
     * Solves the hand passed in, whether 3 cards or 7. Returns various information such as name, description, score and cards involved.
     * @param cards All cards involved in the hand, example: `['Ad', '2d', '3d', '4d', 'Qc', 'Ks', '7h']`. Note that a `10` should be passed as a `T` (`Th` for example).
     * @param game  Which rule set is used, based on the game being played. Default: 'standard'.
     * @param canDisqualify  Is this hand subject to qualification rules, which some games have? Default: false
     */
    static solve(
      cards: string[],
      game?: PokerGame,
      canDisqualify?: boolean
    ): Hand;

    /**
     * Compare the passed hands and determine which is the best hand(s). Can return multiple if there is a tie.
     * @param hands All hands solved with `Hand.solve` that should be compared.
     */
    static winners(hands: Hand[]): Hand | Hand[];
  }
}
