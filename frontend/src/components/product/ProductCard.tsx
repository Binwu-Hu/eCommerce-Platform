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
          className='h-49 object-cover'
          onClick={handleCardClick}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/sample.jpg';
          }}
        />
      }
    >
      <div className='flex flex-col justify-between h-full text-center'>
        <div className='flex flex-col justify-between flex-grow mb-4'>
          <h3 className='font-semibold text-lg'>{product.name}</h3>
          <p
            style={{
              display: 'block',
              height: '5.25rem',
              lineHeight: '1.3125rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
            }}
            className='text-gray-500 text-left mt-2'
          >
            {product.description}
          </p>
        </div>

        <div>
          <p className='text-xl font-bold'>${product.price.toFixed(2)}</p>

          <div className='flex justify-center space-x-2 mt-4'>
            <AddtoCartButton
              productId={product._id}
              text={product.stock === 0 ? 'Sold out' : 'Add'}
              className='font-semibold text-lg px-8 py-2'
              disabled={product.stock === 0}
            />
            <ProductEdit
              product={product}
              className='font-semibold text-lg px-8 py-2'
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
