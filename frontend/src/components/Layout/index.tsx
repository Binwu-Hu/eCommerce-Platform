import Footer from './Footer'
import Header from './Header'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import React from 'react'
import { Container } from 'react-bootstrap'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout className='min-h-screen'>
      <Header />

      <main className='py-3'>
        <Container>
          <Outlet />
          {/* mains child route elements of App should be rendered */}
        </Container>
      </main>

      {/* <Content className='flex-grow flex justify-center items-center bg-gray-100'>
        <Outlet />
      </Content> */}

      <Footer />
    </Layout>
  )
}

export default App
