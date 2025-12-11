import * as _ from "lodash/fp"

export type Color = "red" | "blue" | "green" | "yellow" | "wild"

export enum CardType {
  Number = "Number",
  Skip = "Skip",
  Reverse = "Reverse",
  DrawTwo = "DrawTwo",
  Wild = "Wild",
  WildDrawFour = "WildDrawFour",
}

export type Card = Readonly<{
  color: Color
  type: CardType
  value?: number
}>

// Alias for the assignment wording
export type Type = CardType

// Precise card sub-types
export type NumberCard = Readonly<{
  color: Exclude<Color, "wild">
  type: CardType.Number
  value: number
}>

export type SkipCard = Readonly<{
  color: Exclude<Color, "wild">
  type: CardType.Skip
}>

export type ReverseCard = Readonly<{
  color: Exclude<Color, "wild">
  type: CardType.Reverse
}>

export type DrawTwoCard = Readonly<{
  color: Exclude<Color, "wild">
  type: CardType.DrawTwo
}>

export type WildCard = Readonly<{
  color: "wild"
  type: CardType.Wild
}>

export type WildDrawFourCard = Readonly<{
  color: "wild"
  type: CardType.WildDrawFour
}>

// Utility typed card mapping
export type TypedCard<T extends CardType> =
  T extends CardType.Number ? NumberCard :
  T extends CardType.Skip ? SkipCard :
  T extends CardType.Reverse ? ReverseCard :
  T extends CardType.DrawTwo ? DrawTwoCard :
  T extends CardType.Wild ? WildCard :
  T extends CardType.WildDrawFour ? WildDrawFourCard : Card;

export type Player = Readonly<{
  id: string
  name: string
  hand: readonly Card[]
  saidUno: boolean
}>

export type Uno = Readonly<{
  players: readonly Player[]
  drawPile: readonly Card[]
  discardPile: readonly Card[]
  currentPlayer: number
  direction: 1 | -1
  activeColor: Color
  winner?: string
}>
/*
Immutable types
✔ No mutation
✔ Same pattern as Yahtzee
*/
