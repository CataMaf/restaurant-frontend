import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import socket from '../socket'; // Importă conexiunea WebSocket
import menuData from '../menuData.json';

const MenuWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: auto;
`;

const Category = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CategoryHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const Product = styled.div`
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductHeader = styled.div`
  background-color: #f9f9f9;
  color: #333;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const ProductDetails = styled.div`
  padding: 10px;
  display: ${(props) => (props.expanded ? 'block' : 'none')};
  background-color: #fff;
`;

const Item = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    socket.connect(); // Conectează socket-ul

    return () => {
      socket.disconnect(); // Deconectează socket-ul la demontare
    };
  }, []);

  const toggleCategory = (categoryIndex) => {
    setExpandedCategory((prev) => (prev === categoryIndex ? null : categoryIndex));
    setExpandedProduct(null); // Resetează produsele extinse când o altă categorie este extinsă
  };

  const toggleProduct = (productIndex) => {
    setExpandedProduct((prev) => (prev === productIndex ? null : productIndex));
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const handleSendOrder = () => {
    const order = {
      tableId: id_masa,
      items: cart,
    };
    socket.emit('new-order', order); // Trimite comanda către server
    setCart([]); // Golește coșul
    setConfirmationMessage('Comanda a fost trimisă!');
    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <MenuWrapper>
      <h1>Meniu pentru Masa {id_masa}</h1>
      {menuData.map((category, categoryIndex) => (
        <Category key={categoryIndex}>
          <CategoryHeader onClick={() => toggleCategory(categoryIndex)}>
            {category.category}
          </CategoryHeader>
          {expandedCategory === categoryIndex && (
            <div>
              {category.items.map((item, productIndex) => (
                <Product key={productIndex}>
                  <ProductHeader onClick={() => toggleProduct(productIndex)}>
                    {item.name}
                  </ProductHeader>
                  <ProductDetails expanded={expandedProduct === productIndex}>
                    <Item>
                      <div>
                        <strong>{item.name}</strong>: {item.description} - <strong>{item.price} RON</strong>
                      </div>
                      <Button onClick={() => handleAddToCart(item)}>Adaugă</Button>
                    </Item>
                  </ProductDetails>
                </Product>
              ))}
            </div>
          )}
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
                <span>
                  {item.name} - {item.price} RON
                </span>
                <Button onClick={() => handleRemoveFromCart(i)}>Șterge</Button>
              </Item>
            ))}
          </ul>
        )}
        <Total>Total: {total} RON</Total>
        {cart.length > 0 && (
          <Button onClick={handleSendOrder}>Trimite Comanda</Button>
        )}
        {confirmationMessage && (
          <p style={{ color: 'green', marginTop: '10px' }}>{confirmationMessage}</p>
        )}
      </CartWrapper>
    </MenuWrapper>
  );
};

export default TableMenu;
