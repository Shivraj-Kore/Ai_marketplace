// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtistRegister from './pages/ArtistRegister';
import StorePage from './pages/StorePage';
import StoreFront from './pages/StoreFront';
import HomePage from './pages/HomePage';


const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-gray-800 min-h-screen">
        <div className="App">
        <header className="App-header">
          <nav>
            <ul className="flex space-x-4 p-4 bg-gray-800 text-white">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/Register">Register</Link>
              </li>
              <li>
                <Link to="/artist-register">Artist Register</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store-front" element={<StoreFront />} />
            <Route path="/artist-register" element={<ArtistRegister />} />
          </Routes>
        </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
