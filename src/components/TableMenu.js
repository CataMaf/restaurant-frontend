import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import socket from '../socket';
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

const CartButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  font-size: 16px;
  border-radius: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const TableMenu = () => {
  const { id_masa } = useParams();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.emit('get-cart', { tableId: id_masa });
    socket.on('cart-data', (data) => {
      // Arată butonul dacă există fie produse în coș, fie produse comandate
      setHasItems(data.length > 0);
    });

    return () => {
      socket.disconnect();
    };
  }, [id_masa]);

  const toggleCategory = (categoryIndex) => {
    setExpandedCategory((prev) => (prev === categoryIndex ? null : categoryIndex));
    setExpandedProduct(null);
  };

  const toggleProduct = (productIndex) => {
    setExpandedProduct((prev) => (prev === productIndex ? null : productIndex));
  };

  const handleAddToCart = (item) => {
    socket.emit('add-to-cart', { tableId: id_masa, item });
    setHasItems(true);
  };

  const navigateToCart = () => {
    navigate(`/masa/${id_masa}/cos`);
  };

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
                      <Button onClick={() => handleAddToCart(item)}>Adaugă în coș</Button>
                    </Item>
                  </ProductDetails>
                </Product>
              ))}
            </div>
          )}
        </Category>
      ))}
      {hasItems && (
        <CartButton onClick={navigateToCart}>
          Vezi coșul
        </CartButton>
      )}
    </MenuWrapper>
  );
};

export default TableMenu;
