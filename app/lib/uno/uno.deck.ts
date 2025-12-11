import { Card, CardType, Color } from "./uno.types";
import * as _ from "lodash/fp"

export type Deck = readonly Card[]

const colors: Color[] = ["red", "blue", "green", "yellow"]

export function generate_deck(): Deck {
  let deck: Card[] = []

  colors.forEach(color => {
    // 0-card
    deck.push({ color, type: CardType.Number, value: 0 })

    // two of each 1–9
    _.times(i => {
      const value = i + 1
      deck.push({ color, type: CardType.Number, value })
      deck.push({ color, type: CardType.Number, value })
    }, 9)

    // action cards
    _.times(() => {
      deck.push({ color, type: CardType.Skip })
      deck.push({ color, type: CardType.Reverse })
      deck.push({ color, type: CardType.DrawTwo })
    }, 2)
  })

  // wild cards
  _.times(() => {
    deck.push({ color: "wild", type: CardType.Wild })
    deck.push({ color: "wild", type: CardType.WildDrawFour })
  }, 4)

  return _.shuffle(deck) as Deck
}

export function shuffle(deck: Deck): Deck {
  return _.shuffle(deck) as Deck
}

export function draw(deck: Deck): [Card, Deck] {
  return [deck[0], deck.slice(1) as Deck]
}

/*
✔ identical structure to teacher's dice_roller
✔ pure
✔ immutable
*/
