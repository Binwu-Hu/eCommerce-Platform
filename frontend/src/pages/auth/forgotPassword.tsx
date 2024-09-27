import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { sendResetPasswordLink } from '../../features/user/userSlice';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (values: { email: string }) => {
    dispatch(sendResetPasswordLink(values.email));
    setEmailSent(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!emailSent ? (
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Title level={3}>Update your password</Title>
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Title level={4}>We have sent the update password link to your email</Title>
          <Text>Please check your email and follow the instructions.</Text>
        </Card>
      )}
    </div>
  );
};

export default ForgotPassword;
