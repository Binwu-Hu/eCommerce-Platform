import { Button, message } from 'antd';
import { Product, deleteProduct } from '../../features/product/productSlice';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

interface ProductDeleteProps {
  product: Product;
  className?: string;
}

const ProductDelete: React.FC<ProductDeleteProps> = ({
  product,
  className,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: any) => state.user.user);

  const handleDeleteClick = async (event: React.MouseEvent) => {
    event.stopPropagation();

    const confirmDelete = window.confirm(
      'Are you sure you want to delete the product?'
    );
    if (!confirmDelete) {
      return;
    }

    if (product.owner !== currentUser?.id) {
      message.error("You are not allowed to delete other vendors' product.");
      return;
    }

    try {
      // Dispatch the deleteProduct action and unwrap the result to handle the response
      await dispatch(deleteProduct(product._id)).unwrap();
      message.success('Product deleted successfully');

      navigate('/');
    } catch (error) {
      message.error(error as string); // Display the error message from the rejection
    }
  };

  return product.owner === currentUser?.id ? (
    <Button
      type='primary'
      danger
      onClick={handleDeleteClick}
      className={className}
    >
      Delete
    </Button>
  ) : null;
};

export default ProductDelete;
