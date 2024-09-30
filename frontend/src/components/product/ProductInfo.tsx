import { AppDispatch, RootState } from '../../app/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddtoCartButton from '../cart/AddtoCartButton';
import { Product } from '../../features/product/productSlice';
import ProductEdit from './ProductEdit';
import { fetchCart } from '../../features/cart/cartSlice';
import ProductDelete from './ProductDelete';

const ProductInfo: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  return (
    <div className='flex flex-col justify-between'>
      <div>
        <p className='text-gray-500'>{product.category}</p>
        <h1 className='text-4xl font-bold my-2'>{product.name}</h1>
        <p className='text-2xl font-semibold my-2'>
          ${product.price}{' '}
          <div className='my-2'>
            <span className='text-red-500'>
              {product.stock === 0 ? 'Out of Stock' : ''}
            </span>
          </div>
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
        <ProductDelete product={product} />
      </div>
    </div>
  );
};

export default ProductInfo;
