import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TableMenu from './components/TableMenu';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/masa/:id_masa" element={<TableMenu />} />
    </Routes>
  );
}

export default App;
