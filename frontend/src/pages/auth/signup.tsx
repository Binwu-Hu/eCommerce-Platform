import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../features/user/userSlice';
import AuthForm from '../../components/auth/form';

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = (values: { name: string; email: string; password: string }) => {
    dispatch(signupUser(values));
  };

  return (
    <div>
      <h2>Signup</h2>
      <AuthForm
        fields={[
          { name: 'name', label: 'Name', inputType: 'text' },
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

export default Signup;
