import { AppDispatch, RootState } from '../../app/store';
import { Pagination, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from './ProductCard';
import SortingOptions from './SortingOptions';
import { fetchProducts } from '../../features/products/productSlice';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Pagination and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('last_added');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Function to handle sorting logic
  const sortProducts = (option: string) => {
    setSortOption(option);
    // You can extend this logic to sort the products based on the selected option
    // For example, by updating the products in state or in the backend query
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <SortingOptions sortOption={sortOption} onSortChange={sortProducts} />
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
