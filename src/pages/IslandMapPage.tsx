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
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIslands = async () => {
      await new Promise((r) => setTimeout(r, 300));
      setIslands([
        { id: 1, name: "Остров Слов", total_words: 100, lastCollectTime: Date.now() - 15000, productionCap: 30 },
        { id: 2, name: "Грамматический утёс", total_words: 100, lastCollectTime: Date.now() - 7000, productionCap: 20 },
        { id: 3, name: "Синтаксическая бухта", total_words: 100, lastCollectTime: Date.now() - 90000, productionCap: 60 },
      ]);
    };

    const fetchCoins = async () => {
      setCoins(320);
      setAnimatingCoins(320);
    };

    fetchIslands();
    fetchCoins();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < islands.length - 1) {
        setCanShowInfo(false);
        setTimeout(() => setCurrentIndex(i => i + 1), 100);
        setTimeout(() => setCanShowInfo(true), 400);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCanShowInfo(false);
        setTimeout(() => setCurrentIndex(i => i - 1), 100);
        setTimeout(() => setCanShowInfo(true), 400);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  const handleCollect = () => {
    const updatedIslands = [...islands];
    const current = updatedIslands[currentIndex];
    const produced = Math.min(Math.floor((now - current.lastCollectTime) / 1000), current.productionCap);
    current.lastCollectTime = now;
    setIslands(updatedIslands);
    setCoins(prev => prev + produced);

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

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#fff", overflow: "hidden" }}>
      {/* Top panel */}
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
          }}>
            3212
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <img src="https://tikopa.ru/spell/assets/ui/coins_counter.png" alt="Монеты" style={{ width: "25vw", maxWidth: 100 }} />
          <span style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold", color: "#000", fontSize: "0.9rem",
          }}>
            {animatingCoins}
          </span>
        </div>
      </div>

      {/* Arrow buttons */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        display: "flex", justifyContent: "space-between",
        transform: "translateY(-50%)", padding: "0 16px", zIndex: 10,
      }}>
        <div style={{ width: 40, height: 40 }}>
          {currentIndex > 0 ? (
            <button onClick={() => setCurrentIndex(i => i - 1)} style={{ background: "none", border: "none" }}>
              <img src="https://tikopa.ru/spell/assets/ui/button_left.png" alt="Назад" style={{ width: 40 }} />
            </button>
          ) : <div style={{ width: 40 }} />}
        </div>
        <div style={{ width: 40, height: 40 }}>
          {currentIndex < islands.length - 1 ? (
            <button onClick={() => setCurrentIndex(i => i + 1)} style={{ background: "none", border: "none" }}>
              <img src="https://tikopa.ru/spell/assets/ui/button_right.png" alt="Вперёд" style={{ width: 40 }} />
            </button>
          ) : <div style={{ width: 40 }} />}
        </div>
      </div>

      {/* Swipeable area */}
      <div {...handlers} style={{ height: "100%" }}>
        <div style={{
          display: "flex", transform: `translateX(-${currentIndex * 100}vw)`,
          transition: "transform 0.5s ease", height: "100%",
        }}>
          {islands.map((island, index) => {
            const localProduced = Math.min(Math.floor((now - island.lastCollectTime) / 1000), island.productionCap);
            const effectiveProgress = Math.min(localProduced, island.total_words);
            return (
              <div key={island.id} style={{
                width: "100vw", flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center",
              }}>
                <div style={{
                  padding: "1rem", width: "100%", display: "flex",
                  flexDirection: "column", alignItems: "center",
                }}>
                  <img
                    src={`https://tikopa.ru/spell/assets/islands/${island.id}.png`}
                    alt={island.name}
                    style={{
                      width: "70vw", maxWidth: "300px", marginBottom: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => index === currentIndex && canShowInfo && handleCollect()}
                  />
                  <div style={{
                    width: "80%", height: "10px", backgroundColor: "#eee",
                    borderRadius: "5px", marginBottom: "1rem",
                  }}>
                    <div style={{
                      width: `${(effectiveProgress / island.total_words) * 100}%`,
                      height: "100%", backgroundColor: "#22c55e", borderRadius: "5px",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                  <div style={{
                    opacity: index === currentIndex && canShowInfo ? 1 : 0,
                    pointerEvents: index === currentIndex && canShowInfo ? "auto" : "none",
                    transform: index === currentIndex && canShowInfo ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}>
                    <h2>{island.name}</h2>
                    <p>Прогресс: {effectiveProgress} / {island.total_words}</p>
                    <button style={{
                      padding: "0.5rem 1.5rem", backgroundColor: "#2563eb",
                      color: "#fff", border: "none", borderRadius: "0.375rem",
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
      <div style={{
        position: "absolute", bottom: 0, width: "100%", padding: "1rem",
        display: "flex", justifyContent: "space-around",
      }}>
        <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", padding: 0 }}>
          <img src="https://tikopa.ru/spell/assets/ui/button_settings.png" alt="Настройки"
            style={{ width: "20vw", maxWidth: 80 }} />
        </button>
        <button style={{ background: "none", border: "none", padding: 0 }}>
          <img src="https://tikopa.ru/spell/assets/ui/button_islands.png" alt="Острова"
            style={{ width: "20vw", maxWidth: 80 }} />
        </button>
        <button style={{ background: "none", border: "none", padding: 0 }}>
          <img src="https://tikopa.ru/spell/assets/ui/button_book.png" alt="Другое"
            style={{ width: "20vw", maxWidth: 80 }} />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div onClick={() => setShowSettings(false)} style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", minWidth: "200px",
          }}>
            <h3>Настройки</h3>
            <button onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }} style={{
              padding: "0.5rem 1rem", backgroundColor: "#dc2626",
              color: "#fff", border: "none", borderRadius: "0.375rem", cursor: "pointer",
            }}>
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}