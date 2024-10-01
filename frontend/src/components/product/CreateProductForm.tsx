import { Button, Form, Input, message, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  price: number | string; // price can be a number or string due to input handling
  stock: number | string; // stock can be a number or string due to input handling
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
  const [imageFile, setImageFile] = useState<File | null>(null);  // New state for image file
  const [imageMethod, setImageMethod] = useState<'upload' | 'url'>('url'); // To track image upload method

  useEffect(() => {
    const isFormIncomplete =
      !formData.name ||
      !formData.description ||
      !formData.category ||
      formData.price === '' ||  // Check if price is empty
      formData.stock === '' ||  // Check if stock is empty
      formData.price === undefined ||
      formData.stock === undefined;

    setIsButtonDisabled(isFormIncomplete);
  }, [formData]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Apply restrictions for price and stock
    if (name === 'price') {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (regex.test(value) || value === '') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === 'stock') {
      const intRegex = /^\d*$/; // Allow only non-negative integers
      if (intRegex.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (file: File) => {
    const imageData = new FormData();
    imageData.append('image', file); // Append the image file to FormData
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post('/api/products/upload', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the token here
        },
      });
      const imageUrl = `http://localhost:3000${response.data.imageUrl}`;
      setImagePreview(imageUrl); // Set preview image
  
      setFormData((prevData) => ({ ...prevData, image: imageUrl })); // Update formData with the image URL
    } catch (error) {
      message.error('Failed to upload image');
    }
  };
  
  // Use useEffect to log the updated imagePreview
  useEffect(() => {
    if (imagePreview) {
      console.log('Updated image preview', imagePreview);
    }
  }, [imagePreview]); // This effect will run every time `imagePreview` is updated
  

  // Handle image URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
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

  // Validate if URL is an image
  const validateImageUrl = (url: string): boolean => {
    const pattern = /\.(jpeg|jpg|gif|png)$/;
    return pattern.test(url);
  };

  const handleSubmit = async () => {
    const price = parseFloat(formData.price?.toString() || '0');
    const stock = parseInt(formData.stock?.toString() || '0', 10);

    if (price < 0 || price !== +price.toFixed(2)) {
      return message.error('Price must be a non-negative number with up to 2 decimal places');
    }

    if (stock < 0 || !Number.isInteger(stock)) {
      return message.error('Stock must be a non-negative integer');
    }

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
              type='text'
              placeholder='Enter price'
              className='rounded-md'
            />
          </Form.Item>

          <Form.Item label='In Stock Quantity' required>
            <Input
              name='stock'
              value={formData?.stock}
              onChange={handleInputChange}
              type='text'
              placeholder='Enter stock quantity'
              className='rounded-md'
            />
          </Form.Item>
        </div>

        {/* Image Upload Method */}
        <Form.Item label="Choose Image Method">
          <Button
            type={imageMethod === 'upload' ? 'primary' : 'default'}
            onClick={() => setImageMethod('upload')}
          >
            Upload Image
          </Button>
          <Button
            type={imageMethod === 'url' ? 'primary' : 'default'}
            onClick={() => setImageMethod('url')}
            style={{ marginLeft: '10px' }}
          >
            Use Image URL
          </Button>
        </Form.Item>

        {imageMethod === 'upload' ? (
          <Form.Item label='Image Upload'>
            <Upload
              beforeUpload={(file) => {
                setImageFile(file); // Store the selected file in state
                handleImageUpload(file); // Upload the image immediately
                return false; // Prevent automatic upload by Ant Design
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        ) : (
          <Form.Item label='Image URL'>
            <Input
              name='image'
              value={formData?.image}
              onChange={handleImageUrlChange}
              placeholder='http://'
              className='rounded-md'
            />
          </Form.Item>
        )}
        <div className="border-2 border-dashed border-gray-300 p-6 my-6 flex justify-center items-center h-40">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt='Image Preview'
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
