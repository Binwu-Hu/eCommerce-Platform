import { AppDispatch, RootState } from '../../app/store';
import { Button, Pagination, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from './ProductCard';
import SortingOptions from './SortingOptions';
import { fetchProducts } from '../../features/product/productSlice';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const isAdmin = useSelector((state: RootState) => state.user?.user?.isAdmin);

  // get page number from localStorage
  const getStoredPage = () => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? Number(storedPage) : 1;
  };

  // get sorting mode from localStorage
  const getStoredSortOption = () => {
    const storedSort = localStorage.getItem('sortOption');
    return storedSort || 'last_added';
  };

  const [currentPage, setCurrentPage] = useState(getStoredPage());
  const [sortOption, setSortOption] = useState(getStoredSortOption());
  const pageSize = 8;

  useEffect(() => {
    dispatch(fetchProducts(keyword));
  }, [dispatch, keyword]);

  // store currentPage
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', String(page));
  };

  // store sorting mode
  const sortProducts = (option: string) => {
    setSortOption(option);
    localStorage.setItem('sortOption', option);
  };

  const handleAddProduct = () => {
    navigate('/create-product');
  };

  // sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price_low_to_high') {
      return a.price - b.price;
    } else if (sortOption === 'price_high_to_low') {
      return b.price - a.price;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // get current page products
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          {isAdmin && (
            <Button
              type='primary'
              onClick={handleAddProduct}
              className='bg-blue-500'
            >
              Add Product
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6'>
        {paginatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className='flex justify-center mt-6'>
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={products.length}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default ProductList;
