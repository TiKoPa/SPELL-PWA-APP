import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import IslandMapPage from './pages/IslandMapPage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <SplashScreen onFinish={() => setLoaded(true)} />}
      {loaded && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/map" element={<IslandMapPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
