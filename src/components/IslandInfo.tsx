import React from "react";

interface Island {
  id: number;
  name: string;
  total_words: number;
  lastCollectTime: number;
  productionCap: number;
}

export default function IslandInfo({ island }: { island: Island }) {
  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>{island.name}</h2>
      <p>Слов: {island.total_words}</p>
      <p>Производительность: {island.productionCap}/мин</p>
    </div>
  );
}