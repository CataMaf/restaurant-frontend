import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import socket from '../socket';

const CartWrapper = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Item = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

const RequestBillButton = styled(Button)`
  background-color: #28a745;
  width: 100%;
  padding: 15px;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }
`;

const BackButton = styled(Button)`
  background-color: #6c757d;
  margin-bottom: 20px;

  &:hover {
    background-color: #5a6268;
  }
`;

const Total = styled.h3`
  margin-top: 20px;
  padding-top: 10px;
  border-top: 2px solid #ddd;
`;

const Cart = () => {
  const { id_masa } = useParams();
  const navigate = useNavigate();
  const [currentCart, setCurrentCart] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    socket.connect();

    socket.emit('get-cart', { tableId: id_masa });

    socket.on('cart-data', (data) => {
      const ordered = data.filter(item => item.comandat);
      const current = data.filter(item => !item.comandat);
      setOrderedItems(ordered);
      setCurrentCart(current);
    });

    return () => {
      socket.disconnect();
    };
  }, [id_masa]);

  const handleRemoveFromCart = (indexToRemove) => {
    socket.emit('remove-from-cart', { tableId: id_masa, itemIndex: indexToRemove });
  };

  const handleSendOrder = () => {
    const order = {
      tableId: id_masa,
      items: currentCart,
    };
    socket.emit('new-order', order);
    setConfirmationMessage('Comanda a fost trimisă!');
    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  const handleRequestBill = () => {
    socket.emit('solicita-nota', { tableId: id_masa });
    setConfirmationMessage('Nota de plată a fost solicitată!');
    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  const handleBackToMenu = () => {
    navigate(`/masa/${id_masa}`);
  };

  const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price, 0);
  };

  return (
    <CartWrapper>
      <BackButton onClick={handleBackToMenu}>
        Înapoi la meniu
      </BackButton>
      <h1>Coș pentru Masa {id_masa}</h1>
      
      <Section>
        <h2>Produse în coș</h2>
        {currentCart.length === 0 ? (
          <p>Nu există produse în coș.</p>
        ) : (
          <>
            {currentCart.map((item, index) => (
              <Item key={index}>
                <span>{item.name} - {item.price} RON</span>
                <DeleteButton onClick={() => handleRemoveFromCart(index)}>Șterge</DeleteButton>
              </Item>
            ))}
            <Total>Total coș curent: {calculateTotal(currentCart)} RON</Total>
            <Button onClick={handleSendOrder}>Trimite Comanda</Button>
          </>
        )}
      </Section>

      <Section>
        <h2>Produse comandate</h2>
        {orderedItems.length === 0 ? (
          <p>Nu există produse comandate.</p>
        ) : (
          <>
            {orderedItems.map((item, index) => (
              <Item key={index}>
                <span>{item.name} - {item.price} RON</span>
              </Item>
            ))}
            <Total>Total comenzi: {calculateTotal(orderedItems)} RON</Total>
            <RequestBillButton onClick={handleRequestBill}>
              Solicită nota de plată
            </RequestBillButton>
          </>
        )}
      </Section>

      {confirmationMessage && (
        <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>
          {confirmationMessage}
        </p>
      )}
    </CartWrapper>
  );
};

export default Cart;