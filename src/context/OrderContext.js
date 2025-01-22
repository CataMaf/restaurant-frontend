import React, { createContext, useState } from 'react';

// Creăm contextul
export const OrderContext = createContext();

// Provider-ul pentru a împărtăși starea comenzilor
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
