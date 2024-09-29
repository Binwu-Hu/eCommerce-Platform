import { AppDispatch, RootState } from '../../app/store';
import React, { useEffect, useState } from 'react';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd';

interface AddtoCartButtonProps {
  productId: string;
  text: string;
}

const AddtoCartButton: React.FC<AddtoCartButtonProps> = ({
  productId,
  text,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState<number>(0);
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      const cartItem = items.find((item) => item.productId === productId);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    } else {
      const localCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      const localCartItem = localCartItems.find(
        (item: { productId: string }) => item.productId === productId
      );
      if (localCartItem) {
        setQuantity(localCartItem.quantity);
      }
    }
  }, [dispatch, isAuthenticated, items, productId]);

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1);
      dispatch(addItemToCart({ productId, quantity: 1 }));
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(
      updateCartItemQuantityLocal({
        productId,
        quantity: quantity + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      setQuantity(0);
      dispatch(removeItemFromCart(productId));
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(
        updateCartItemQuantityLocal({
          productId,
          quantity: quantity - 1,
        })
      );
    }
  };

  return (
    <>
      {quantity === 0 ? (
        <Button
          type='primary'
          className='bg-blue-500 h-8 text-lg px-6'
          onClick={handleAddToCart}
        >
          {text}
        </Button>
      ) : (
        <div className='flex items-center'>
          <Button onClick={handleDecrement}>-</Button>
          <span className='mx-2'>{quantity}</span>
          <Button onClick={handleIncrement}>+</Button>
        </div>
      )}
    </>
  );
};

export default AddtoCartButton;
