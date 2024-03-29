/* src/Components/Games/War.svelte generated by Svelte v3.48.0 */
import { SvelteComponent, init, safe_not_equal } from "../../../snowpack/pkg/svelte/internal.js";

function instance($$self) {
	var SUITS = {
		SPADES: "Spades",
		HEARTS: "Hearts",
		CLUBS: "Clubs",
		DIAMONDS: "Diamonds",
		JOKER: "Joker"
	};

	class Card {
		constructor(suit = "Null", value = -1) {
			this.suit = suit;
			this.value = value;
		}
	}

	class Deck {
		constructor(size = 0, joker = false) {
			this.cards = [];
			this.addCards(size, joker);
		}

		addCards(amount = 1, joker = false, card = new Card()) {
			if (card.suit == "Null") {
				if (joker) {
					var suits = 5;
				} else {
					var suits = 4;
				}

				for (var i = 0; i < amount; i++) {
					this.cards.push(new Card(Object.values(SUITS)[Math.floor(Math.random() * suits)], Math.floor(Math.random() * 13)));
				}
			} else {
				for (var i = 0; i < amount; i++) {
					this.cards.push(card);
				}
			}
		}

		// Knuth Shuffle
		shuffle() {
			let currentIndex = this.cards.length, randomIndex;

			while (currentIndex != 0) {
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;
				[this.cards[currentIndex], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[currentIndex]];
			}
		}

		fullDeck(jokers = false) {
			this.cards = [];

			for (let i = 1; i <= 13; i++) {
				this.cards.push(new Card(SUITS.HEARTS, i));
				this.cards.push(new Card(SUITS.DIAMONDS, i));
				this.cards.push(new Card(SUITS.SPADES, i));
				this.cards.push(new Card(SUITS.CLUBS, i));
			}

			if (jokers) {
				this.cards.push(new Card(SUITS.JOKER, 0));
				this.cards.push(new Card(SUITS.JOKER, 0));
			}
		}
	}

	class Hand extends Deck {
		constructor(player, visible, size = 0, joker = false) {
			super(size, joker);
			this.visible = visible;
			this.player = player;
		}

		getTop() {
			var top = this.cards[0];
			this.cards.shift();
			return top;
		}

		addBottom(adds) {
			this.cards = this.cards.concat(adds);
		}
	}

	class War {
		constructor(players) {
			this.players = [];

			for (let i = 0; i < players.length; i++) {
				this.players.push(new Hand(players[i], false));
			}
		}
	}

	return [];
}

class War_1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, null, safe_not_equal, {});
	}
}

export default War_1;