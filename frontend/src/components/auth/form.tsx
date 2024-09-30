import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Radio } from 'antd';

interface FormProps {
  formType: 'login' | 'signup' | 'forgotPassword' | 'resetPassword';
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const AuthForm: React.FC<FormProps> = ({ formType, onSubmit, loading }) => {
  const [isVendor, setIsVendor] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVendor(e.target.checked);
  };

  const handleSubmit = (values: any) => {
    if (formType === 'login') {
      onSubmit({ ...values, isVendor });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      {formType === 'signup' && (
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
      )}

      {formType !== 'resetPassword' && (
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
      )}

      {(formType === 'login' || formType === 'signup') && (
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 4, message: 'Password must be at least 4 characters long!' }
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
      )}

      {formType === 'resetPassword' && (
        <>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 4, message: 'Password must be at least 4 characters long!' }
            ]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your password' }
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
        </>
      )}

      {formType === 'signup' && (
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Radio.Group>
            <Radio value="Customer">Customer</Radio>
            <Radio value="Vendor">Vendor</Radio>
          </Radio.Group>
        </Form.Item>
      )}

      {formType === 'login' && (
        <Form.Item>
          <Checkbox checked={isVendor} onChange={handleCheckboxChange}>
            Want to login as a vendor?
          </Checkbox>
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {formType === 'login'
            ? 'Sign In'
            : formType === 'signup'
            ? 'Create Account'
            : formType === 'resetPassword'
            ? 'Reset Password'
            : 'Update Password'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
