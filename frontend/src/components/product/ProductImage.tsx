import React from 'react';

const ProductImage: React.FC<{ image: string }> = ({ image }) => {
  return (
    <div className='w-full h-full'>
      <img src={image} alt='Product' className='w-full h-auto object-cover' />
    </div>
  );
};

export default ProductImage;
