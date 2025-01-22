import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import menuData from '../menuData.json';

const MenuWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: auto;
`;

const Category = styled.div`
  margin-bottom: 20px;
`;

const Item = styled.li`
  margin: 10px 0;
  list-style: none;
  padding: 15px;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f9f9f9;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #a71d2a;
  }
`;

const CartWrapper = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Total = styled.h3`
  margin-top: 20px;
`;

const TableMenu = () => {
  const { id_masa } = useParams();
  const [cart, setCart] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isOrderSent, setIsOrderSent] = useState(false);

  // Inițializăm conexiunea WebSocket
  const socket = io('http://localhost:4000');

  useEffect(() => {
    // Efect de curățare: Deconectăm socket-ul la demontarea componentei
    return () => {
      socket.disconnect();
    };
  }, []);

  // Adaugă articol în coș
  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  // Șterge articol din coș
  const handleRemoveFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // Trimite comanda
  const handleSendOrder = () => {
    const order = {
      tableId: id_masa,
      items: cart,
    };
    socket.emit('new-order', order); // Trimite comanda către server
    setCart([]); // Golește coșul
    setIsOrderSent(true); // Marchează comanda ca fiind trimisă
    setConfirmationMessage('Comanda a fost recepționată!');
    setTimeout(() => setConfirmationMessage(''), 3000); // Ascunde mesajul după 3 secunde
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <MenuWrapper>
      <h1>Meniu pentru Masa {id_masa}</h1>
      {menuData.map((category, index) => (
        <Category key={index}>
          <h2>{category.category}</h2>
          <ul>
            {category.items.map((item, i) => (
              <Item key={i}>
                <div>
                  <strong>{item.name}</strong>: {item.description} - <strong>{item.price} RON</strong>
                </div>
                <Button onClick={() => handleAddToCart(item)}>Adaugă</Button>
              </Item>
            ))}
          </ul>
        </Category>
      ))}
      <CartWrapper>
        <h2>Coș</h2>
        {cart.length === 0 ? (
          <p>Coșul este gol.</p>
        ) : (
          <ul>
            {cart.map((item, i) => (
              <Item key={i}>
                <span>{item.name} - {item.price} RON</span>
                <DeleteButton onClick={() => handleRemoveFromCart(i)}>Șterge</DeleteButton>
              </Item>
            ))}
          </ul>
        )}
        <Total>Total: {total} RON</Total>
        {!isOrderSent && cart.length > 0 && (
          <Button onClick={handleSendOrder}>Trimite Comanda</Button>
        )}
        {confirmationMessage && <p style={{ color: 'green', marginTop: '10px' }}>{confirmationMessage}</p>}
      </CartWrapper>
    </MenuWrapper>
  );
};

export default TableMenu;
