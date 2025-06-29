import { useEffect, useState } from "react";

export type Island = {
  id: number;
  name: string;
  picture: string;
  productionCap: number;
  lastCollected: string;
  progress: number;
};

export type UserData = {
  coins: number;
  energy: number;
  level: number;
  islands: Island[];
};

export function useUserData(token: string | null) {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await fetch("https://functions.yandexcloud.net/d4eb0b1bkjhfji50el51", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { data, loading, error };
}