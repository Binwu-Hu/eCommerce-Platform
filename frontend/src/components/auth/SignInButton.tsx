import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const SignInButton = () => {
  return (
    <div className='flex items-center space-x-2'>
      <UserOutlined style={{ fontSize: '20px' }} />
      <Link
        to='/login'
        style={{ color: 'inherit', textDecoration: 'none' }}
        className='hover:text-yellow-500'
      >
        Sign In
      </Link>
    </div>
  );
};

export default SignInButton;
