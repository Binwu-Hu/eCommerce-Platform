import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/user/userSlice';
import AuthForm from '../../components/auth/form';

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
      <p>
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default Login;
