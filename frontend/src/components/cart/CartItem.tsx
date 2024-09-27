import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../features/cart/cartSlice';

import { AppDispatch } from '../../app/store';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

interface CartItemProps {
  item: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItemQuantity({
          productId: item.productId,
          quantity: item.quantity - 1,
        })
      );
    } else {
      handleRemove(); // Remove item if the quantity is 1 and user clicks minus
    }
  };

  // Handle quantity increase
  const handleIncrease = () => {
    dispatch(
      updateCartItemQuantity({
        productId: item.productId,
        quantity: item.quantity + 1,
      })
    );
  };

  // Handle removing an item from the cart
  const handleRemove = () => {
    dispatch(removeItemFromCart(item.productId));
  };

  return (
    <div className='flex justify-between items-center mb-4'>
      {/* Product Image and Info */}
      <div className='flex items-center space-x-4'>
        <img
          src={item.image}
          alt={item.name}
          className='w-16 h-16 object-cover'
        />
        <div>
          <p className='font-semibold'>{item.name}</p>
          <p className='text-blue-500'>{`$${item.price}`}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center space-x-2'>
        <Button
          icon={<MinusOutlined />}
          onClick={handleDecrease}
          disabled={item.quantity === 1} // Disable if quantity is 1 (use remove instead)
        />
        <span>{item.quantity}</span>
        <Button icon={<PlusOutlined />} onClick={handleIncrease} />
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
