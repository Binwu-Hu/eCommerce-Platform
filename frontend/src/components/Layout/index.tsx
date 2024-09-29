import Footer from './Footer';
import Header from './Header';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className='min-h-screen'>
      <Header />

      <Content className='flex-grow flex justify-center items-center bg-gray-100'>
        <Outlet />
      </Content>

      <Footer />
    </Layout>
  );
};

export default App;
