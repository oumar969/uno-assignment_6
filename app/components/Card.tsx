"use client";
import React from "react";

interface Props {
  color: string | null;
  type: string | null;
  value?: number | null;
  back?: boolean;
  onClick?: () => void;
}

export default function Card({ color, type, value, back, onClick }: Props) {
  function getCardImage() {
    if (back) return "/cards/Back.png";
    if (!color || !type) return "/cards/Deck.png";

    const c = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    const t = type.toLowerCase();

    if (t === "number" && value !== null && value !== undefined) {
      return `/cards/${c}_${value}.png`;
    }

    switch (t) {
      case "skip":
        return `/cards/${c}_Skip.png`;
      case "reverse":
        return `/cards/${c}_Reverse.png`;
      case "drawtwo":
      case "draw2":
        return `/cards/${c}_Draw.png`;
      case "wild":
        return `/cards/Wild.png`;
      case "wilddrawfour":
      case "wild_draw4":
        return `/cards/Wild_DrawFour.png`;
      default:
        return "/cards/Deck.png";
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: "70px",
        height: "100px",
        borderRadius: "10px",
        margin: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={getCardImage()}
        alt={type ?? "card"}
        style={{ width: "80%", height: "80%", objectFit: "contain" }}
      />
    </div>
  );
}
