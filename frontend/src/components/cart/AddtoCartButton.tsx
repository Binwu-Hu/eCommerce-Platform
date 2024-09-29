import { Button } from 'antd';
import React from 'react';
import { useCartQuantityHandler } from './useCartQuantityHandler';
interface AddtoCartButtonProps {
  productId: string;
  text: string;
}

const AddtoCartButton: React.FC<AddtoCartButtonProps> = ({
  productId,
  text,
}) => {
  const { quantity, handleAddToCart, handleIncrement, handleDecrement } =
    useCartQuantityHandler(productId);

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
