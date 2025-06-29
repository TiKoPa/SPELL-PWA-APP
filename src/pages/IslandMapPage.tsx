import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar";
import IslandSlider from "../components/IslandSlider";
import SettingsModal from "../components/SettingsModal";
import BottomBar from "../components/BottomBar";

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

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#fff", overflow: "hidden" }} {...handlers}>
      <TopBar energy={3212} coins={animatingCoins} />
      <IslandSlider
        islands={islands}
        currentIndex={currentIndex}
        onPrev={() => currentIndex > 0 && setCurrentIndex(i => i - 1)}
        onNext={() => currentIndex < islands.length - 1 && setCurrentIndex(i => i + 1)}
      />
      <BottomBar
        onCollect={handleCollect}
        onSettings={() => setShowSettings(true)}
        onNavigate={() => navigate("/level")}
      />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}