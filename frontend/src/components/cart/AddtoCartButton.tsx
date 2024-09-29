import { AppDispatch, RootState } from '../../app/store';
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd';
import React from 'react';

interface AddtoCartButtonProps {
  productId: string;
  text: string;
}

const AddtoCartButton: React.FC<AddtoCartButtonProps> = ({
  productId,
  text,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Find the item in the cart (either Redux store or localStorage)
  const cartItem = items.find((item) => item.productId === productId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (quantity === 0) {
      dispatch(addItemToCart({ productId, quantity: 1 }));
    }
  };

  const handleIncrement = () => {
    if (isAuthenticated) {
      // For logged-in users, update the cart on the server
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: quantity + 1,
        })
      );
    } else {
      // For unauthenticated users, update the local storage cart
      dispatch(
        updateCartItemQuantityLocal({
          productId,
          quantity: quantity + 1,
        })
      );
    }
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      dispatch(removeItemFromCart(productId));
    } else if (quantity > 1) {
      if (isAuthenticated) {
        // For logged-in users, update the cart on the server
        dispatch(
          updateCartItemQuantity({
            productId,
            quantity: quantity - 1,
          })
        );
      } else {
        // For unauthenticated users, update the local storage cart
        dispatch(
          updateCartItemQuantityLocal({
            productId,
            quantity: quantity - 1,
          })
        );
      }
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
