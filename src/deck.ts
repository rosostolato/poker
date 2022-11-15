import { Card } from './types';
import { shuffle } from './utils';

const suitMap = ['s', 'h', 'd', 'c'];
const rankMap = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
];

export class Deck {
  cards: Card[];

  private size: number;

  constructor() {
    this.cards = [];
    this.size = 52;

    let index = 0;
    for (let suit = 0; suit < 4; suit++) {
      for (let rank = 0; rank < 13; rank++) {
        this.cards[index++] = this.createCard(rank, suit);
      }
    }

    this.restart();
  }

  draw(): Card {
    if (this.size === 0) {
      this.restart();
    }
    return this.cards[--this.size];
  }

  restart(): void {
    this.size = 52;
    shuffle(this.cards);
  }

  private createCard(rank: number, suit: number): Card {
    return `${rankMap[rank]}${suitMap[suit]}`;
  }
}
