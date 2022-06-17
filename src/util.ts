export class Card {
    suit: string;
    value: number;

    constructor() {
        
    }

    constructor(suit: string, value: number) {
        this.suit = suit;
        this.value = value;
    }
}

enum Suits {
    CLUBS = "Clubs",
    HEARTS = "Hearts",
    SPADES = "Spades",
    DIAMONDS = "Diamonds",
    JOKER = "Joker"
}

enum CardTypes {
    ACE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = 11,
    QUEEN = 12,
    KING = 13,
    JOKER = 0,
}

export class Deck {
    deck: Array<Card>;

    constructor(decks: number) {
        this.deck = []
        for (let i = 1; i < 14; i++) {
            this.deck.push(new Card(Suits.CLUBS), i)
            this.deck.push(new Card(Suits.HEARTS), i)
            this.deck.push(new Card(Suits.DIAMONDS), i)
            this.deck.push(new Card(Suits.SPADES), i)
        }
        this.deck.push(new Card(Suits.JOKER, 0))
        this.deck.push(new Card(Suits.JOKER, 0))
    }

    constructor(deck: Array) {
        this.deck = deck;
    }

    shuffle() {

    }
}