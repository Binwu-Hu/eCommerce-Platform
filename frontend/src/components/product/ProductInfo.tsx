import AddtoCartButton from '../cart/AddtoCartButton';
import { Product } from '../../features/product/productSlice';
import React from 'react';
import ProductEdit from './ProductEdit';

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
        <p className='text-gray-600 mb-6'>{product.description}</p>
      </div>

      <div className='flex space-x-4 mt-6'>
        <AddtoCartButton
          productId={product._id}
          text={product.stock === 0 ? 'Sold out' : 'Add to Cart'}
          disabled={product.stock === 0}
        />
        <ProductEdit product={product} />
      </div>
    </div>
  );
};

export default ProductInfo;
