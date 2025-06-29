import React from "react";
import IslandInfo from "./IslandInfo";

export default function IslandSlider({
  islands,
  currentIndex,
  onPrev,
  onNext
}: {
  islands: any[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const island = islands[currentIndex];

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <button onClick={onPrev} disabled={currentIndex === 0} style={{ position: "absolute", left: 10, top: "50%" }}>
        ◀
      </button>

      <div>
        <img
          src={`https://tikopa.ru/spell/assets/islands/${island?.id}.png`}
          alt={island?.name}
          style={{ width: "70vw", maxWidth: 400 }}
        />
        {island && <IslandInfo island={island} />}
      </div>

      <button onClick={onNext} disabled={currentIndex === islands.length - 1} style={{ position: "absolute", right: 10, top: "50%" }}>
        ▶
      </button>
    </div>
  );
}