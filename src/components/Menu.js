import React, { useState } from 'react';
import styled from 'styled-components';
import menuData from '../menuData.json';

const MenuWrapper = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: auto;
`;

const Category = styled.div`
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
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
  max-width: 800px;
  margin: 30px auto;
`;

const CartItem = styled.li`
  list-style: none;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Total = styled.h3`
  margin-top: 20px;
  color: #333;
`;

const Menu = () => {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  return (
    <MenuWrapper>
      <h1 style={{ textAlign: 'center' }}>Restaurant Menu</h1>
      {menuData.map((category, index) => (
        <Category key={index}>
          <h2>{category.category}</h2>
          <ul>
            {category.items.map((item, i) => (
              <Item key={i}>
                <div>
                  <strong>{item.name}</strong>: {item.description} - <strong>{item.price} RON</strong>
                </div>
                <Button onClick={() => handleAddToCart(item)}>Adaugă în coș</Button>
              </Item>
            ))}
          </ul>
        </Category>
      ))}
      <Cart cart={cart} onRemove={handleRemoveFromCart} />
    </MenuWrapper>
  );
};

const Cart = ({ cart, onRemove }) => {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartWrapper>
      <h2>Coș de cumpărături</h2>
      {cart.length === 0 ? (
        <p>Coșul este gol.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <CartItem key={index}>
              <span>{item.name} - {item.price} RON</span>
              <DeleteButton onClick={() => onRemove(index)}>Șterge</DeleteButton>
            </CartItem>
          ))}
        </ul>
      )}
      <Total>Total: {total} RON</Total>
    </CartWrapper>
  );
};

export default Menu;
