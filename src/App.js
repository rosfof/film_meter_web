import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Peliculas from './pages/Peliculas';
import Series from './pages/Series';
import Estrenos from './pages/Estrenos';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/series" element={<Series />} />
        <Route path="/estrenos" element={<Estrenos />} />
      </Routes>
    </Router>
  );
}

export default App;