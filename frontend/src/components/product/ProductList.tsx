import { AppDispatch, RootState } from '../../app/store';
import { Button, Pagination, Spin, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from './ProductCard';
import SortingOptions from './SortingOptions';
import { fetchCart } from '../../features/cart/cartSlice';
import { fetchProducts } from '../../features/product/productSlice';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { keyword } = useParams();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

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
    return storedSort || 'id_asc'; // default sort by _id ascending
  };

  const [currentPage, setCurrentPage] = useState(getStoredPage());
  const [sortOption, setSortOption] = useState(getStoredSortOption());
  const [showOwnedProducts, setShowOwnedProducts] = useState(false); // for "Show Only My Products"
  const [showInStockProducts, setShowInStockProducts] = useState(false); // for "In Stock Products"
  const pageSize = 8;

  useEffect(() => {
    dispatch(fetchProducts(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

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

  // Filter products based on the two checkboxes
  const filteredProducts = products.filter((product) => {
    let matchesOwner = true;
    let inStock = true;

    if (showOwnedProducts) {
      matchesOwner = product.owner === user?.id;
    }

    if (showInStockProducts) {
      inStock = product.stock !== 0;
    }

    return matchesOwner && inStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price_low_to_high') {
      return a.price - b.price;
    } else if (sortOption === 'price_high_to_low') {
      return b.price - a.price;
    } else if (sortOption === 'id_asc') {
      return a._id.localeCompare(b._id);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get current page products
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
      <h2 className='text-2xl font-semibold'>Products</h2>
      <div className='flex justify-end'>
        <div className='flex items-center space-x-4 sm:space-x-2'>
          {isAdmin && (
            <Checkbox
              checked={showOwnedProducts}
              onChange={(e) => {
                setShowOwnedProducts(e.target.checked);
                setCurrentPage(1); // Reset page to 1 when filter changes
              }}
            >
              Show Only My Products
            </Checkbox>
          )}
          <Checkbox
            checked={showInStockProducts}
            onChange={(e) => {
              setShowInStockProducts(e.target.checked);
              setCurrentPage(1); // Reset page to 1 when filter changes
            }}
          >
            In Stock Products
          </Checkbox>
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6 custom-grid'>
        {paginatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <style jsx>{`
        @media (min-width: 1025px) and (max-width: 1268px) {
          .custom-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (min-width: 765px) and (max-width: 1024px) {
          .custom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 764px) {
          .custom-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className='flex justify-center mt-6'>
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={filteredProducts.length} // Use filtered products count for pagination
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default ProductList;
