'use client'
import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AuthenticatedRoute from '../components/AuthenticatedRoute';

const { Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  const getSelectedKey = (path: string) => {
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/users')) return 'users';
    return '';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">User Management</Link>,
    },
  ];

  return (
    <AuthenticatedRoute>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[getSelectedKey(pathname)]}
            items={menuItems}
          />
        </Sider>
        <Content style={{ padding: '24px' }}>{children}</Content>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default AdminLayout;
