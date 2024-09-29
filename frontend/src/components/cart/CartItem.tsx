import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { Button } from 'antd';
import { CartItem as Item } from '../../features/cart/cartSlice';
import React from 'react';
import { useCartQuantityHandler } from './useCartQuantityHandler';

interface CartItemProps {
  item: Item;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { handleIncrement, handleRemoveFromCart, handleDecrement } =
    useCartQuantityHandler(item.productId);

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
          <p className='text-blue-500'>{`$${item.price}`}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center space-x-2'>
        <Button
          icon={<MinusOutlined />}
          onClick={handleDecrement}
          disabled={item.quantity === 1}
        />
        <span>{item.quantity}</span>
        <Button icon={<PlusOutlined />} onClick={handleIncrement} />
      </div>

      {/* Remove Item Button */}
      <Button
        type='text'
        className='text-red-500'
        icon={<DeleteOutlined />}
        onClick={() => handleRemoveFromCart(item.productId)}
      >
        Remove
      </Button>
    </div>
  );
};

export default CartItem;
