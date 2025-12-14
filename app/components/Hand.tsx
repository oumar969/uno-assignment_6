"use client";
import React from "react";
import Card from "./Card";

interface Props {
  hand: any[];
  onPlay?: (card: any, index: number) => void;
}

export default function Hand({ hand, onPlay }: Props) {
  if (!hand || hand.length === 0) return null;
  
  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
      {hand.map((card, i) => (
        <Card
          key={i}
          color={card.color}
          type={card.type}
          value={card.value}
          onClick={onPlay ? () => onPlay(card, i) : undefined}
        />
      ))}
    </div>
  );
}
