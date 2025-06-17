import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 💡 Заглушка: фейковый пользователь
      setTimeout(() => {
        setUser({
          id: 1,
          email: 'demo@spell.app',
          name: 'Demo User',
        });
        setLoading(false);
      }, 300);
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
