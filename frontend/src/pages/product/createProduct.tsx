import CreateProductForm from '../../components/product/CreateProductForm';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import ErrorPage from '../error/ErrorPage'; 

const ProductPage: React.FC = () => {
  const isAdmin = useSelector((state: RootState) => state.user?.user?.isAdmin);

  return (
    <div className='container mx-auto py-8 px-4'>
      {isAdmin ? (
        <div className='mb-6'>
          <CreateProductForm />
        </div>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default ProductPage;
