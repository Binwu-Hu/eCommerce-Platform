import { Button, Form, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createProduct,
  updateProduct,
} from '../../features/product/productSlice';

interface CreateProductFormProps {
  product?: Product;
}

interface Product {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const CreateProductForm: React.FC<CreateProductFormProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const isFormIncomplete =
      !formData.name ||
      !formData.description ||
      !formData.category;
    setIsButtonDisabled(isFormIncomplete);
  }, [formData]);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateImageUrl = (url: string): boolean => {
    const pattern = /\.(jpeg|jpg|gif|png)$/;
    return pattern.test(url);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setImageError(false);

    setFormData((prevData) => ({
      ...prevData,
      image: value,
    }));

    if (value === '') {
      setImagePreview(null);
    } else if (validateImageUrl(value)) {
      setImagePreview(value);
    } else {
      message.error('Please enter a valid image URL');
      setImagePreview(null);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    try {
      if (product && product._id) {
        await dispatch(updateProduct({ id: product._id, data: formData }));
      } else {
        await dispatch(createProduct(formData as Product));
      }
      navigate('/');
    } catch (err) {
      console.error('Form submission failed:', err);
    }
  };

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-center'>
        {product ? 'Update Product' : 'Create New Product'}
      </h2>

      <Form layout='vertical' onFinish={handleSubmit}>
        <Form.Item label='Product Name' required>
          <Input
            name='name'
            value={formData?.name}
            onChange={handleInputChange}
            placeholder='Enter product name'
            className='rounded-md'
          />
        </Form.Item>

        <Form.Item label='Product Description' required>
          <Input.TextArea
            name='description'
            value={formData?.description}
            onChange={handleInputChange}
            placeholder='Enter product description'
            className='rounded-md'
          />
        </Form.Item>

        <Form.Item label='Category' required>
          <Input
            name='category'
            value={formData?.category}
            onChange={handleInputChange}
            placeholder='Enter category'
            className='rounded-md'
          />
        </Form.Item>

        <div className='grid grid-cols-2 gap-4'>
          <Form.Item label='Price' required>
            <Input
              name='price'
              value={formData?.price}
              onChange={handleInputChange}
              type='number'
              placeholder='Enter price'
              className='rounded-md'
            />
          </Form.Item>

          <Form.Item label='In Stock Quantity' required>
            <Input
              name='stock'
              value={formData?.stock}
              onChange={handleInputChange}
              type='number'
              placeholder='Enter stock quantity'
              className='rounded-md'
            />
          </Form.Item>
        </div>

        <Form.Item label='Image URL'>
          <Input
            name='image'
            value={formData?.image}
            onChange={handleImageChange}
            placeholder='http://'
            className='rounded-md'
          />
        </Form.Item>
        
        <div className="border-2 border-dashed border-gray-300 p-6 my-6 flex justify-center items-center h-40">
          {imagePreview && !imageError ? (
            <img
              src={imagePreview}
              alt='Image Preview'
              onError={handleImageError}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400">Image Preview</span>
          )}
        </div>

        <div className='text-center mt-6'>
          <Button
            type='primary'
            htmlType='submit'
            className={`w-full py-2 rounded-lg text-white ${
              isButtonDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isButtonDisabled}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateProductForm;
