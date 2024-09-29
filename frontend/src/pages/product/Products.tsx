import CreateProductForm from '../../components/product/CreateProductForm'; // Only show if admin
import ProductList from '../../components/product/ProductList';
import React from 'react';

const ProductPage: React.FC = () => {
  const isAdmin = true;
  return (
    <div className='container mx-auto py-8 px-4'>
      {isAdmin && (
        <div className='mb-6'>
          <CreateProductForm />
        </div>
      )}

      <ProductList />
    </div>
  );
};

export default ProductPage;
