import React from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../features/user/userSlice'; 
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';
import AuthForm from '../../components/auth/Form';

const { Title } = Typography;

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = (values: { password: string; confirmPassword: string }) => {
    if (values.password === values.confirmPassword) {
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
        <AuthForm formType="resetPassword" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
};

export default ResetPassword;
