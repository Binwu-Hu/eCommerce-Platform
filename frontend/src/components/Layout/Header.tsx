import { AppDispatch, RootState } from '../../app/store';
import { Input, Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import CartTrigger from '../cart/CartTrigger';
import { logout } from '../../features/user/userSlice';

const { Header } = Layout;

const MergedHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Header className='bg-black text-white px-4'>
      <div className='flex justify-between items-center w-full'>
        <div className='text-2xl font-bold text-white flex-shrink-0'>
          <Link to='/' style={{ color: 'white' }}>
            E-Commerce
          </Link>
          <span className='text-base text-white'> Management Chuwa</span>
        </div>

        <div className='flex items-center space-x-4 w-1/4 flex-shrink'>
          <Input
            placeholder='Search'
            suffix={<SearchOutlined className='text-gray-400' />}
            className='rounded-md w-full'
          />
        </div>

        <div className='flex items-center space-x-6'>
          <Menu
            theme='dark'
            mode='horizontal'
            className='bg-black text-white flex space-x-6'
          >
            {isAuthenticated ? (
              <Menu.Item
                key='1'
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  transition: 'color 0.3s',
                }}
                className='hover:text-yellow-500'
              >
                <div className='flex items-center space-x-2'>
                  <UserOutlined style={{ fontSize: '20px' }} />
                  <span>Sign Out</span>
                </div>
              </Menu.Item>
            ) : (
              <Menu.Item
                key='1'
                style={{ backgroundColor: 'transparent', color: 'white' }}
                className='hover:text-yellow-500'
              >
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
              </Menu.Item>
            )}

            <Menu.Item key='2'>
              <CartTrigger />
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Header>
  );
};

export default MergedHeader;
