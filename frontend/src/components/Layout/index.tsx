import { Layout } from 'antd';
// import Navbar from 'components/Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (

      <Layout>
        <Layout.Header >
          {/* <Navbar /> */}
        </Layout.Header>
        <Layout.Content >
          <Outlet />
        </Layout.Content>
        <Layout.Footer >this is footer</Layout.Footer>
      </Layout>

  );
}