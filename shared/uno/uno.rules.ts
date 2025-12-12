import { Card, CardType, Color } from "./uno.types"

export function is_match(card: Card, top: Card, active: Color): boolean {
  if (card.color === "wild") return true
  if (card.color === active) return true
  if (card.type === top.type) return true

  return (
    card.type === CardType.Number &&
    top.type === CardType.Number &&
    card.value === top.value
  )
}
