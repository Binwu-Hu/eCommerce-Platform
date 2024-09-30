import { AppDispatch, RootState } from '../../app/store';
import { Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CartTrigger from '../cart/CartTrigger';
import SearchBox from '../product/SearchBox';
import { UserOutlined } from '@ant-design/icons';
import { logout } from '../../features/user/userSlice';
import { resetCart } from '../../features/cart/cartSlice';

const { Header } = Layout;

const MergedHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    navigate('/');
  };

  return (
    <Header className='bg-black text-white px-0 md:px-4 h-12 md:h-20 mb-10 md:mb-0'>
      <div className='flex flex-col md:flex-row justify-between items-center w-full'>
        <div className='text-2xl font-bold text-white flex-shrink-0'>
          <Link to='/' style={{ color: 'white' }}>
            E-Commerce
          </Link>
          <span className='text-base text-white hidden md:inline'>
            {' '}
            Management Chuwa
          </span>
        </div>

        <div className='hidden lg:block'>
          <SearchBox />
        </div>

        <div className='flex justify-center md:justify-end items-center w-full md:w-auto bg-black px-4'>
          <Menu
            theme='dark'
            mode='horizontal'
            className='bg-black text-white flex space-x-1'
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

            <Menu.Item key='2' style={{ backgroundColor: 'transparent' }}>
              <div className='flex items-center space-x-2'>
                <CartTrigger />
              </div>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Header>
  );
};

export default MergedHeader;
