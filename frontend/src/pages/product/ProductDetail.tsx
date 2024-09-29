import React, { useEffect, useState } from 'react';

import { AppDispatch } from '../../app/store';
import { Product } from '../../features/product/productSlice';
import ProductImage from '../../components/product/ProductImage';
import ProductInfo from '../../components/product/ProductInfo';
import { Spin } from 'antd';
import { fetchProductById } from '../../features/product/productSlice';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const result = await dispatch(fetchProductById(id)).unwrap();
          setProduct(result);
          setError(null);
        } catch (err) {
          console.log(err);
          setError('Failed to load the product.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-96'>
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 text-center'>Error: {error}</div>;
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-semibold mb-4'>Products Detail</h1>
      {product && (
        <div className='grid grid-cols-2 gap-8'>
          <ProductImage image={product.image} />
          <ProductInfo product={product} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
