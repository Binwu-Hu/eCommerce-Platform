import { AppDispatch, RootState } from '../../app/store';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  removeItemFromCart,
  removeItemFromCartLocal,
  updateCartItemQuantity,
  updateCartItemQuantityLocal,
} from '../../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'antd';
import { CartItem as Item } from '../../features/cart/cartSlice';
import React from 'react';

interface CartItemProps {
  item: Item;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Handle quantity decrease
  const handleDecrement = () => {
    if (item.quantity === 1) {
      handleRemove();
    } else if (item.quantity > 1) {
      if (isAuthenticated) {
        // For logged-in users, update the cart on the server
        dispatch(
          updateCartItemQuantity({
            productId: item.productId,
            quantity: item.quantity - 1,
          })
        );
      } else {
        // For unauthenticated users, update the local storage cart
        dispatch(
          updateCartItemQuantityLocal({
            productId: item.productId,
            quantity: item.quantity - 1,
          })
        );
      }
    }
  };

  const handleIncrement = () => {
    if (isAuthenticated) {
      // For logged-in users, update the cart on the server
      dispatch(
        updateCartItemQuantity({
          productId: item.productId,
          quantity: item.quantity + 1,
        })
      );
    } else {
      // For unauthenticated users, update the local storage cart
      dispatch(
        updateCartItemQuantityLocal({
          productId: item.productId,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  // Handle removing an item from the cart
  const handleRemove = () => {
    if (isAuthenticated) {
      dispatch(removeItemFromCart(item.productId));
    } else {
      dispatch(removeItemFromCartLocal(item.productId));
    }
  };

  return (
    <div className='flex justify-between items-center mb-4'>
      <div className='flex items-center space-x-4'>
        <img
          src={item.image}
          alt={item.name}
          className='w-16 h-16 object-cover'
        />
        <div>
          <p className='font-semibold'>{item.name}</p>
          <p className='text-blue-500'>{item.price}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center space-x-2'>
        <Button
          icon={<MinusOutlined />}
          onClick={handleDecrement}
          disabled={item.quantity === 1} // Disable if quantity is 1 (use remove instead)
        />
        <span>{item.quantity}</span>
        <Button icon={<PlusOutlined />} onClick={handleIncrement} />
      </div>

      {/* Remove Item Button */}
      <Button
        type='text'
        className='text-red-500'
        icon={<DeleteOutlined />}
        onClick={handleRemove}
      >
        Remove
      </Button>
    </div>
  );
};

export default CartItem;
