import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../features/user/userSlice'; 
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (values: { password: string; confirmPassword: string }) => {
    if (values.password === values.confirmPassword) {
        // console.log(token);
      dispatch(resetPassword({ token, password: values.password }));
      navigate('/login');
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={3}>Reset your password</Title>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item name="password" label="New Password" rules={[{ required: true, min: 4, message: 'Password must be at least 4 characters' }]}>
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true, message: 'Please confirm your password' }]}>
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
