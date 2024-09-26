import { Input, Layout, Menu } from 'antd';
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';

import React from 'react';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className='bg-black text-white px-4'>
      <div className='flex justify-between items-center w-full'>
        <div className='text-2xl font-bold text-white flex-shrink-0'>
          Management <span className='text-base text-white'>Chuwa</span>
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
            <Menu.Item key='1'>
              <div className='flex items-center space-x-2'>
                <UserOutlined style={{ fontSize: '20px' }} />
                <span>Sign In</span>
              </div>
            </Menu.Item>
            <Menu.Item key='2'>
              <div className='flex items-center space-x-2'>
                <ShoppingCartOutlined style={{ fontSize: '20px' }} />
                <span>$0.00</span>
              </div>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
