import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

interface Island {
  id: number;
  name: string;
  total_words: number;
  lastCollectTime: number;
  productionCap: number;
}

export default function IslandMapPage() {
  const [islands, setIslands] = useState<Island[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canShowInfo, setCanShowInfo] = useState(true);
  const [coins, setCoins] = useState(0);
  const [animatingCoins, setAnimatingCoins] = useState(coins);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIslands = async () => {
      await new Promise((r) => setTimeout(r, 300));
      setIslands([
        {
          id: 1,
          name: "Остров Слов",
          total_words: 100,
          lastCollectTime: Date.now() - 15000,
          productionCap: 30,
        },
        {
          id: 2,
          name: "Грамматический утёс",
          total_words: 100,
          lastCollectTime: Date.now() - 7000,
          productionCap: 20,
        },
        {
          id: 3,
          name: "Синтаксическая бухта",
          total_words: 100,
          lastCollectTime: Date.now() - 90000,
          productionCap: 60,
        },
      ]);
    };

    const fetchCoins = async () => {
      setCoins(320);
      setAnimatingCoins(320);
    };

    fetchIslands();
    fetchCoins();
  }, []);

  // 🔁 Обновляем "текущее время" каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < islands.length - 1) {
        setCanShowInfo(false);
        setTimeout(() => setCurrentIndex((i) => i + 1), 100);
        setTimeout(() => setCanShowInfo(true), 400);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCanShowInfo(false);
        setTimeout(() => setCurrentIndex((i) => i - 1), 100);
        setTimeout(() => setCanShowInfo(true), 400);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const handleCollect = () => {
    const updatedIslands = [...islands];
    const current = updatedIslands[currentIndex];
    const produced = Math.min(
      Math.floor((now - current.lastCollectTime) / 1000),
      current.productionCap,
    );

    current.lastCollectTime = now;
    setIslands(updatedIslands);

    setCoins((prev) => prev + produced);

    let temp = animatingCoins;
    const step = Math.ceil((coins + produced - animatingCoins) / 10);
    const animate = setInterval(() => {
      temp += step;
      if (temp >= coins + produced) {
        clearInterval(animate);
        setAnimatingCoins(coins + produced);
      } else {
        setAnimatingCoins(temp);
      }
    }, 40);
  };

  const currentIsland = islands[currentIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Top panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => setCurrentIndex(islands.length - 1)}>
          <img src="/icons/last.png" alt="Последний" style={{ width: 32, height: 32 }} />
        </button>
        <button onClick={() => navigate("/login")}>
          <img src="/icons/exit.png" alt="Выход" style={{ width: 32, height: 32 }} />
        </button>
        <div>
          <img src="/icons/coin.png" alt="Монеты" style={{ width: 24, verticalAlign: "middle" }} />{" "}
          {animatingCoins}
        </div>
      </div>

      {/* Arrow buttons */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transform: "translateY(-50%)",
          padding: "0 16px",
          zIndex: 10,
        }}
      >
        <div style={{ width: 40, height: 40 }}>
          {currentIndex > 0 ? (
            <button
              onClick={() => setCurrentIndex((i) => i - 1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src="/icons/left-arrow.png" alt="Назад" style={{ width: 40, height: 40 }} />
            </button>
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
        </div>
        <div style={{ width: 40, height: 40 }}>
          {currentIndex < islands.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src="/icons/right-arrow.png" alt="Вперёд" style={{ width: 40, height: 40 }} />
            </button>
          ) : (
            <div style={{ width: 40, height: 40 }} />
          )}
        </div>
      </div>

      {/* Swipeable area */}
      <div {...handlers} style={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}vw)`,
            transition: "transform 0.5s ease",
            height: "100%",
          }}
        >
          {islands.map((island, index) => {
            const localProduced = Math.min(
              Math.floor((now - island.lastCollectTime) / 1000),
              island.productionCap,
            );
            const effectiveProgress = Math.min(localProduced, island.total_words);

            return (
              <div
                key={island.id}
                style={{
                  width: "100vw",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`https://tikopa.ru/spell/assets/islands/${island.id}.png`}
                    alt={island.name}
                    style={{
                      width: "70vw",
                      maxWidth: "300px",
                      height: "auto",
                      marginBottom: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => index === currentIndex && canShowInfo && handleCollect()}
                  />

                  {/* Прогресс-полоса */}
                  <div
                    style={{
                      width: "80%",
                      height: "10px",
                      backgroundColor: "#eee",
                      borderRadius: "5px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: `${(effectiveProgress / island.total_words) * 100}%`,
                        height: "100%",
                        backgroundColor: "#22c55e",
                        borderRadius: "5px",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>

                  {/* Инфо блок */}
                  <div
                    style={{
                      opacity: index === currentIndex && canShowInfo ? 1 : 0,
                      pointerEvents: index === currentIndex && canShowInfo ? "auto" : "none",
                      transform:
                        index === currentIndex && canShowInfo
                          ? "translateY(0)"
                          : "translateY(10px)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                      {island.name}
                    </h2>
                    <p style={{ marginBottom: "1rem" }}>
                      Прогресс: {effectiveProgress} / {island.total_words}
                    </p>
                    <button
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        fontSize: "1rem",
                        border: "none",
                        borderRadius: "0.375rem",
                      }}
                      onClick={() => alert(`Начать остров: ${island.name}`)}
                    >
                      Начать
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <button>
          <img src="/icons/settings.png" alt="Настройки" style={{ width: 32, height: 32 }} />
        </button>
        <button>
          <img src="/icons/list.png" alt="Острова" style={{ width: 32, height: 32 }} />
        </button>
        <button>
          <img src="/icons/more.png" alt="Другое" style={{ width: 32, height: 32 }} />
        </button>
      </div>
    </div>
  );
}