import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './header';

export default function MainLayout() {
  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
      <Layout.Footer>this is footer</Layout.Footer>
    </Layout>
  );
}
