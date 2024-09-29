import CreateProductForm from '../../components/product/CreateProductForm';
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
    </div>
  );
};

export default ProductPage;
