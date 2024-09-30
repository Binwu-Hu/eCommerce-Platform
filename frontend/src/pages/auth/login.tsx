import { AppDispatch, RootState } from '../../app/store';
import { Card, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { clearError, loginUser } from '../../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import AuthForm from '../../components/auth/Form';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleSubmit = (values: { email: string; password: string; isVendor: boolean }) => {
    const loginData = {
      ...values,
      isAdmin: values.isVendor,
    };
    dispatch(loginUser(loginData));
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
        <AuthForm formType="login" onSubmit={handleSubmit} loading={loading} />
        {error && <Text type="danger">{error}</Text>}
        <Text>
          Don’t have an account? <Link to="/signup">Sign up</Link>
          <br />
          <Link to="/forgot-password">Forgot password?</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Login;