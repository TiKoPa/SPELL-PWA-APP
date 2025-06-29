import { useAuth } from "./AuthContext";
import { useUserData } from "./hooks/useUserData";
import TopBar from "./TopBar"; // обязательно импортировать TopBar

export default function IslandMapPage() {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data, loading, error } = useUserData(token);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return <div>Нет данных</div>;

  return (
    <div className="island-map-page">
      {/* Верхняя панель */}
      <TopBar coins={data.coins} energy={data.energy} />

      {/* Контент островов */}
      <div className="islands-grid">
        {data.islands.map((island) => (
          <div key={island.id} className="island-card">
            <img src={`/images/${island.picture}`} alt={island.name} className="island-image" />
            <h3>{island.name}</h3>
            <p>Прогресс: {island.progress}</p>
            <p>Лимит продукции: {island.productionCap}</p>
            <p>Последний сбор: {new Date(island.lastCollected).toLocaleString()}</p>
            <button disabled>Собрать продукцию</button> {/* Позже активируем */}
          </div>
        ))}
      </div>

      {/* Нижняя панель (если есть) */}
      <footer className="bottom-bar">
        <p>© Island Game</p>
      </footer>
    </div>
  );
}