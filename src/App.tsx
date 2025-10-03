import React from 'react';
import { BrowserRouter as DefaultRouter, Routes, Route } from 'react-router-dom';
import './styles/theme.css';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';

interface AppProps {
  router?: React.ComponentType<{ children: React.ReactNode }>;
}

function App({ router: RouterComponent }: AppProps) {
  const Router = RouterComponent || DefaultRouter;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="container"><HomePage /></div>} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/orders" element={<div className="container"><OrdersPage /></div>} />
      </Routes>
    </Router>
  );
}

export default App;
