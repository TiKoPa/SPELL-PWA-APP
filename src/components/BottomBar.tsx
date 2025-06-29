import React from "react";

export default function BottomBar({
  onCollect,
  onSettings,
  onNavigate
}: {
  onCollect: () => void;
  onSettings: () => void;
  onNavigate: () => void;
}) {
  return (
    <div style={{
      position: "absolute", bottom: 20, width: "100%",
      display: "flex", justifyContent: "space-around"
    }}>
      <button onClick={onCollect}>Собрать</button>
      <button onClick={onNavigate}>Перейти</button>
      <button onClick={onSettings}>⚙️</button>
    </div>
  );
}