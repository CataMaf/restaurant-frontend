import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const DashboardWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const OrderCard = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
`;

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const socket = io('http://192.168.0.103:4000'); // URL-ul serverului WebSocket

  useEffect(() => {
    // Primește comenzile existente
    socket.on('orders', (data) => {
      setOrders(data);
    });

    // Curăță conexiunea la deconectare
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DashboardWrapper>
      <h1>Dashboard Comenzi</h1>
      {orders.length === 0 ? (
        <p>Nu există comenzi momentan.</p>
      ) : (
        orders.map((order, index) => (
          <OrderCard key={index}>
            <h3>Masa {order.tableId}</h3>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} - {item.price} RON
                </li>
              ))}
            </ul>
          </OrderCard>
        ))
      )}
    </DashboardWrapper>
  );
};

export default Dashboard;
