import React from 'react';

const ProductImage: React.FC<{ image: string }> = ({ image }) => {
  return (
    <div className='w-full h-full'>
      <img
        src={image}
        alt='Product'
        className='w-full h-auto object-cover'
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/sample.jpg';
        }}
      />
    </div>
  );
};

export default ProductImage;
