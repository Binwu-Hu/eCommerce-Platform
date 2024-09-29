import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';

import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';

interface Product {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const CreateProductForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch for types
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch({ type: 'products/createProduct', payload: formData as Product });
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      <Form layout='vertical' onFinish={handleSubmit}>
        <Form.Item label='Product name' required>
          <Input
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Product name'
          />
        </Form.Item>
        <Form.Item label='Product Description' required>
          <Input.TextArea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Product Description'
          />
        </Form.Item>
        <Form.Item label='Category' required>
          <Input
            name='category'
            value={formData.category}
            onChange={handleInputChange}
            placeholder='Category'
          />
        </Form.Item>
        <Form.Item label='Price' required>
          <Input
            name='price'
            value={formData.price}
            onChange={handleInputChange}
            type='number'
            placeholder='Price'
          />
        </Form.Item>
        <Form.Item label='In Stock Quantity' required>
          <Input
            name='stock'
            value={formData.stock}
            onChange={handleInputChange}
            type='number'
            placeholder='In Stock Quantity'
          />
        </Form.Item>
        <Form.Item label='Add Image Link' required>
          <Input
            name='image'
            value={formData.image}
            onChange={handleInputChange}
            placeholder='http://'
          />
        </Form.Item>

        <Button type='primary' htmlType='submit' className='bg-blue-500'>
          Add Product
        </Button>
      </Form>
    </div>
  );
};

export default CreateProductForm;
