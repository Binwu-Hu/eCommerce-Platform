import { Button, Card } from 'antd';
import React, { useState } from 'react';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice';

import { AppDispatch } from '../../app/store';
import { Product } from '../../features/product/productSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState<number>(0);

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
      dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(
      updateCartItemQuantityLocal({
        productId: product._id,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      setQuantity(0);
      dispatch(removeItemFromCart(product._id));
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(
        updateCartItemQuantityLocal({
          productId: product._id,
          quantity: quantity - 1,
        })
      );
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          className='h-48 object-cover'
          onClick={handleCardClick}
        />
      }
    >
      <div className='text-center'>
        <h3 className='font-semibold text-lg'>{product.name}</h3>
        <p className='text-gray-500'>{product.description}</p>
        <p className='text-xl font-bold'>${product.price.toFixed(2)}</p>

        <div className='flex justify-center space-x-2 mt-4'>
          {quantity === 0 ? (
            <Button
              type='primary'
              className='bg-blue-500'
              onClick={handleAddToCart}
            >
              Add
            </Button>
          ) : (
            <div className='flex items-center'>
              <Button onClick={handleDecrement}>-</Button>
              <span className='mx-2'>{quantity}</span>
              <Button onClick={handleIncrement}>+</Button>
            </div>
          )}
          <Button type='default'>Edit</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
