import React from "react";

export default function TopBar({ energy, coins }: { energy: number; coins: number }) {
  return (
    <div style={{
      position: "absolute", top: 0, width: "100%", padding: "0rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ position: "relative" }}>
        <img src="https://tikopa.ru/spell/assets/ui/energy_counter.png" alt="Энергия" style={{ width: "25vw", maxWidth: 100 }} />
        <span style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bold", color: "#000", fontSize: "0.9rem",
        }}>{energy}</span>
      </div>
      <div style={{ position: "relative" }}>
        <img src="https://tikopa.ru/spell/assets/ui/coins_counter.png" alt="Монеты" style={{ width: "25vw", maxWidth: 100 }} />
        <span style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bold", color: "#000", fontSize: "0.9rem",
        }}>{coins}</span>
      </div>
    </div>
  );
}