import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';

import { Layout } from 'antd';
import React from 'react';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className='bg-black text-white'>
      <div className='flex justify-between items-center border-t border-gray-700 pt-4'>
        <p>©2024 All Rights Reserved.</p>

        <div className='space-x-4'>
          <YoutubeOutlined style={{ fontSize: '20px' }} />
          <TwitterOutlined style={{ fontSize: '20px' }} />
          <FacebookOutlined style={{ fontSize: '20px' }} />
          <InstagramOutlined style={{ fontSize: '20px' }} />
        </div>

        <div className='flex space-x-4'>
          <a href='/' className='hover:underline'>
            Contact us
          </a>
          <a href='/' className='hover:underline'>
            Privacy Policies
          </a>
          <a href='/' className='hover:underline'>
            Help
          </a>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
