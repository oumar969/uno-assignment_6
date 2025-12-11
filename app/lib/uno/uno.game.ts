import * as _ from "lodash/fp"
import { generate_deck, draw } from "./uno.deck"
import { is_match } from "./uno.rules"
import { Uno, Player, Card, CardType, Color } from "./uno.types"

// ----------------------------------------------------------
// Create new game
// ----------------------------------------------------------

export function new_uno(playersIn: { id: string, name: string }[]): Uno {
  const deck = generate_deck();

  const players = playersIn.map((p, i) => ({
    id: p.id,
    name: p.name,
    saidUno: false,
    hand: deck.slice(i * 7, i * 7 + 7),
  }))


  const discardPile = [deck[players.length * 7]]
  const drawPile = deck.slice(players.length * 7 + 1)
  return {
    players,
    drawPile,
    discardPile,
    currentPlayer: 0,
    direction: 1,
    activeColor: discardPile[0].color,
    winner: undefined
  }
}

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

function next_player(game: Uno): number {
  return (game.currentPlayer + game.direction + game.players.length) % game.players.length
}

function apply_penalty_if_needed(game: Uno): Uno {
  const p = game.players[game.currentPlayer]
  if (p.hand.length === 1 && !p.saidUno) {
    let deck = game.drawPile
    const drawn: Card[] = []

    _.times(() => {
      const [c, d] = draw(deck)
      drawn.push(c)
      deck = d
    }, 4)

    return _.flow([
      _.update(["players", game.currentPlayer, "hand"], (hand: any) => [...hand, ...drawn]),
      _.set("drawPile", deck)
    ])(game)
  }
  return game
}

// ----------------------------------------------------------
// Say UNO
// ----------------------------------------------------------

export function say_uno(game: Uno): Uno {
  return _.set(["players", game.currentPlayer, "saidUno"], true, game)
}

// ----------------------------------------------------------
// Draw card
// ----------------------------------------------------------

export function draw_card(game: Uno): Uno {
  const [card, newDeck] = draw(game.drawPile)

  return _.flow([
    _.update(["players", game.currentPlayer, "hand"], (hand: any) => [...hand, card]),
    _.set("drawPile", newDeck),
    _.set("currentPlayer", next_player(game))
  ])(game)
}

// ----------------------------------------------------------
// Play a card
// ----------------------------------------------------------

export function play_card(
  index: number,
  chosenColor: Color | null,
  game: Uno
): Uno {
  const player = game.players[game.currentPlayer]
  const card = player.hand[index]
  const top = _.last(game.discardPile)!

  // illegal card
  if (!is_match(card, top, game.activeColor)) return game

  let next = _.flow([
    _.update(["players", game.currentPlayer, "hand"], (hand: string | any[]) => [
      ...hand.slice(0, index),
      ...hand.slice(index + 1)
    ]),
    _.update("discardPile", (pile: any) => [...pile, card])
  ])(game)

  // wild color decision
  const newColor =
    card.color === "wild" ? chosenColor ?? next.activeColor : card.color

  // direction & skipping
  let direction = next.direction
  let nextPlayer = next_player(next)

  if (card.type === CardType.Reverse) direction *= -1
  if (card.type === CardType.Skip)
    nextPlayer = (nextPlayer + direction + next.players.length) % next.players.length

  // draw cards
  if (card.type === CardType.DrawTwo || card.type === CardType.WildDrawFour) {
    const amount = card.type === CardType.DrawTwo ? 2 : 4

    let deck = next.drawPile
    const extra: Card[] = []

    _.times(() => {
      const [c, d] = draw(deck)
      extra.push(c)
      deck = d
    }, amount)

    next = _.flow([
      _.update(["players", nextPlayer, "hand"], (hand: any) => [...hand, ...extra]),
      _.set("drawPile", deck)
    ])(next)
  }

  // winner?
  const remaining = next.players[game.currentPlayer].hand.length
  const winner = remaining === 0 ? next.players[game.currentPlayer].name : undefined

  return _.flow([
    _.set("direction", direction),
    _.set("activeColor", newColor),
    _.set("currentPlayer", nextPlayer),
    _.set("winner", winner)
  ])(next)
}
/*
✔ Immutable
✔ Pure
✔ Functional
*/
