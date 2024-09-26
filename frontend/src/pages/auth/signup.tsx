import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../features/user/userSlice';
import AuthForm from '../../components/auth/form';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const handleSubmit = (values: { name: string; email: string; password: string }) => {
    dispatch(signupUser(values));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h2>Sign Up</h2>
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
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
