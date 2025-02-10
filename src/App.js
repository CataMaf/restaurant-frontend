import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TableMenu from './components/TableMenu';
import Cart from './components/Cart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/masa/:id_masa" element={<TableMenu />} />
      <Route path="/masa/:id_masa/cos" element={<Cart />} />
    </Routes>
  );
}

export default App;
