import { Card } from './types';
export declare class Deck {
    cards: Card[];
    private size;
    constructor(size: 52);
    draw(): Card;
    restart(): void;
    private createCard;
}
