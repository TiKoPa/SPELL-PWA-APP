import React from "react";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "#fff", padding: 20 }}>
        <h3>Настройки</h3>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}