import { Card } from 'antd';
import AddtoCartButton from '../cart/AddtoCartButton';
import { Product } from '../../features/product/productSlice';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductEdit from './ProductEdit';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          className="h-48 object-cover"
          onClick={handleCardClick}
        />
      }
    >
      <div className="text-center">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-500">{product.description}</p>
        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>

        <div className="flex justify-center space-x-2 mt-4">
          <AddtoCartButton productId={product._id} text="Add" />
          <ProductEdit product={product} />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
