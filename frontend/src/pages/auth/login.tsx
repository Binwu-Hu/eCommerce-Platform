import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/user/userSlice';
import { Form, Input, Button, Card, Typography } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (values: { email: string; password: string }) => {
    dispatch(loginUser(values));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // clear error message when entering the page
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={3}>Sign in to your account</Title>
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email including @ symbol!' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
        {error && <Text type="danger">{error}</Text>}
        <Text>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;
