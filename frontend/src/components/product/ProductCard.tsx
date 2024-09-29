import { Button, Card } from 'antd';

import { Product } from '../../features/product/productSlice'; // Adjust the import path accordingly
import React from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          className='h-48 object-cover'
        />
      }
    >
      <div className='text-center'>
        <h3 className='font-semibold text-lg'>{product.name}</h3>
        <p className='text-gray-500'>{product.description}</p>
        <p className='text-xl font-bold'>${product.price.toFixed(2)}</p>

        <div className='flex justify-center space-x-2 mt-4'>
          <Button type='primary' className='bg-blue-500'>
            Add
          </Button>
          <Button type='default'>Edit</Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
