import { Button } from 'antd';
import { Product } from '../../features/product/productSlice';
import React from 'react';

const ProductInfo: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className='flex flex-col justify-between'>
      <div>
        <p className='text-gray-500'>{product.category}</p>
        <h1 className='text-4xl font-bold mb-2'>{product.name}</h1>
        <p className='text-2xl font-semibold mb-2'>
          ${product.price}{' '}
          <span className='text-red-500'>
            {product.stock === 0 ? 'Out of Stock' : ''}
          </span>
        </p>
        <p className='text-gray-600 mb-6'>{product.description}</p>{' '}
      </div>

      <div className='flex space-x-4 mt-6'>
        {' '}
        <Button type='primary' className='bg-blue-500 h-10 text-lg px-6'>
          Add To Cart
        </Button>
        <Button className='h-10 text-lg px-6'>Edit</Button>
      </div>
    </div>
  );
};

export default ProductInfo;
