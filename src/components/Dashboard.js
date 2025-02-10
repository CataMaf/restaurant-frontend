import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import socket from '../socket';

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

const HighlightedText = styled.span`
  color: #007bff;
  font-weight: bold;
`;

const ResetButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #a71d2a;
  }
`;

const ConfirmButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const Dashboard = () => {
  const [orders, setOrders] = useState([]); // Comenzile curente

  useEffect(() => {
    socket.connect();
  
    // Solicită datele inițiale pentru dashboard
    socket.emit('request-dashboard-data');
  
    // Ascultăm comenzile primite de la server
    socket.on('orders', (data) => {
      console.log('Comenzi primite de la server:', data); // Logăm comenzile primite
      setOrders(data); // Actualizăm starea comenzilor
    });
  
    return () => {
      socket.off('orders'); // Dezactivăm ascultătorul la demontare
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conexiune WebSocket stabilită');
    });

    socket.on('disconnect', () => {
      console.log('Conexiune WebSocket întreruptă');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  
  const handleConfirmView = (tableId) => {
    console.log(`Trimitere confirmare vizualizare pentru masa ${tableId}`);
    socket.emit('confirm-view', tableId); // Trimite evenimentul către server
  };

  const handleResetTable = (tableId) => {
    console.log(`Resetare masă ${tableId}`);
    socket.emit('reset-table', tableId);
  };

  return (
    <DashboardWrapper>
      <h1>Dashboard Comenzi</h1>
      {orders.map((order) => (
        <OrderCard key={order.tableId}>
          <h3>Masa {order.tableId}</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.viewed ? (
                  item.name
                ) : (
                  <HighlightedText>{item.name}</HighlightedText>
                )}{' '}
                - {item.price} RON
              </li>
            ))}
          </ul>
          {order.hasNewChanges && (
            <ConfirmButton onClick={() => handleConfirmView(order.tableId)}>
              Confirmă Vizualizarea Modificărilor
            </ConfirmButton>
          )}
          <ResetButton onClick={() => handleResetTable(order.tableId)}>Resetează Masa</ResetButton>
        </OrderCard>
      ))}
    </DashboardWrapper>
  );
};

export default Dashboard;