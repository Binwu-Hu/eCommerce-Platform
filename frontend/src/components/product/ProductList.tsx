import { AppDispatch, RootState } from '../../app/store';
import { Button, Pagination, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from './ProductCard';
import SortingOptions from './SortingOptions';
import { useNavigate } from 'react-router-dom';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('last_added');

  useEffect(() => {
    dispatch({ type: 'products/fetchProducts' });
  }, [dispatch]);

  const sortProducts = (option: string) => {
    setSortOption(option);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddProduct = () => {
    navigate('/create-product');
  };

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
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Products</h2>
        <div className='flex items-center space-x-4'>
          <SortingOptions sortOption={sortOption} onSortChange={sortProducts} />
          <Button
            type='primary'
            onClick={handleAddProduct}
            className='bg-blue-500'
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-8 mt-6'>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className='flex justify-center mt-6'>
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={products.length}
          pageSize={8} // Assuming 8 products per page
        />
      </div>
    </div>
  );
};

export default ProductList;