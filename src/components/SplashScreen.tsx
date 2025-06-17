import { useEffect, useState } from "react";
import CenteredLogo from "./CenteredLogo"; // если ты используешь его

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade-in
    const fadeIn = setTimeout(() => setOpacity(1), 100);

    // Завершаем splash без fade-out
    const finish = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(finish);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.5s ease",
        opacity,
      }}
    >
      <CenteredLogo />
    </div>
  );
}
