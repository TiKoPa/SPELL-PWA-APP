import React from "react";

interface CenteredLogoProps {
  shiftUp?: boolean; // если true — логотип сдвигается вверх
  animate?: boolean; // включает/отключает анимацию
  scale?: number; // масштаб логотипа
}

export default function CenteredLogo({
  shiftUp = false,
  animate = true,
  scale = 1,
}: CenteredLogoProps) {
  const logoUrl = "https://tikopa.ru/spell/assets/spell-logo.png";

  const translateY = shiftUp ? "-35%" : "-50%";
  const style: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, ${translateY}) scale(${scale})`,
    width: "70vw",
    maxWidth: "280px",
    height: "auto",
    transition: animate ? "all 0.6s ease" : undefined,
  };

  return <img src={logoUrl} alt="SPELL Logo" style={style} />;
}
