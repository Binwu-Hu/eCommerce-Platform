import { Button, message } from 'antd';
import { Product } from '../../features/product/productSlice';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProductEditProps {
  product: Product;
}

const ProductEdit: React.FC<ProductEditProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const currentUser = useSelector((state: any) => state.user.user);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (product.owner !== currentUser?._id) {
      message.error('You are not allowed to edit other vendors\' product.');
      return;
    }

    navigate('/create-product', { state: { product } });
  };

  return (
    <Button type="default" onClick={handleEditClick}>
      Edit
    </Button>
  );
};

export default ProductEdit;