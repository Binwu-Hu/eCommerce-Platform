import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user/userSlice';
import AuthForm from '../../components/auth/form';

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: { user: { loading: boolean; error: string } }) => state.user);

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log('Submitting form:', values);
    dispatch(loginUser(values));
  };

  return (
    <div>
      <h2>Login</h2>
      <AuthForm
        fields={[
          { name: 'email', label: 'Email', inputType: 'email' },
          { name: 'password', label: 'Password', inputType: 'password' },
        ]}
        onSubmit={handleSubmit}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
