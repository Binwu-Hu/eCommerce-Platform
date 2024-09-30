import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser, clearError } from '../../features/user/userSlice';
import { Card, Typography } from 'antd';
import AuthForm from '../../components/auth/Form';

const { Title, Text } = Typography;

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (values: { name: string; email: string; password: string; role: string }) => {
    const isAdmin = values.role === 'Vendor';
    const signupData = { ...values, isAdmin };
    dispatch(signupUser(signupData));
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
        <Title level={3}>Sign up an account</Title>
        <AuthForm formType="signup" onSubmit={handleSubmit} loading={loading} />
        {error && <Text type="danger">{error}</Text>}
        <Text>
          Already have an account? <Link to="/login">Sign in</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Signup;